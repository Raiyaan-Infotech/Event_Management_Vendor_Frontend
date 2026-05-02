"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ThemePreview } from "@/components/website/ThemePreview";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import ContactUs from "@/components/blocks/ContactUs";
import TermsConditions from "@/components/blocks/TermsConditions";
import PrivacyPolicy from "@/components/blocks/PrivacyPolicy";
import PublicClientLogin from "@/components/blocks/PublicClientLogin";
import PublicClientRegister from "@/components/blocks/PublicClientRegister";
import Loader from "@/components/ui/loader";
import { useVendorPreviewData } from "@/hooks/use-vendor-preview";
import { useVendorPage, useVendorPrivacy, useVendorTerms } from "@/hooks/use-vendor-pages";
import { sanitizeHtml } from "@/lib/sanitize-html";

function PreviewCustomPage({ data, pageId, pageData }: { data?: any; pageId: number | null; pageData?: any }) {
  const listPage = (data?.pages || []).find((item: any) => Number(item.id) === pageId && item.is_active !== 0);
  const page = pageData || listPage;
  const safeContent = sanitizeHtml(page?.content);

  return (
    <div className="px-6 py-16 md:px-8">
      <article className="mx-auto max-w-4xl">
        {page ? (
          <>
            <h1 className="mb-4 text-4xl font-black text-gray-900">{page.name}</h1>
            {page.description && <p className="mb-8 text-lg leading-relaxed text-gray-500">{page.description}</p>}
            {page.content ? (
              <div
                className="prose prose-lg max-w-none text-gray-700 prose-headings:text-gray-900"
                dangerouslySetInnerHTML={{ __html: safeContent }}
              />
            ) : (
              <p className="text-gray-400 italic">This page does not have content yet.</p>
            )}
          </>
        ) : (
          <div className="py-24 text-center">
            <h1 className="text-4xl font-black text-gray-300">404</h1>
            <p className="mt-2 text-gray-500">Page not found.</p>
          </div>
        )}
      </article>
    </div>
  );
}

function PreviewContent() {
  const searchParams = useSearchParams();
  const vendorIdParam = searchParams.get("vendorId");
  const vendorId = vendorIdParam ? parseInt(vendorIdParam) : null;
  const pageIdParam = searchParams.get("pageId");
  const pageId = pageIdParam ? Number(pageIdParam) : null;
  const rawPreviewPage = searchParams.get("previewPage");
  const previewPage =
    rawPreviewPage === "terms-conditions" || rawPreviewPage === "terms_conditions"
      ? "terms"
      : rawPreviewPage === "privacy-policy" || rawPreviewPage === "privacy_policy"
        ? "privacy"
        : rawPreviewPage;
  const { data: vendorData, isLoading } = useVendorPreviewData(vendorId);
  const embeddedSelectedPage = (vendorData?.pages || []).find((item: any) => Number(item.id) === pageId && item.is_active !== 0);
  const shouldFetchTerms = previewPage === "terms" && !!vendorData && !vendorData.terms_content;
  const shouldFetchPrivacy = previewPage === "privacy" && !!vendorData && !vendorData.privacy_content;
  const shouldFetchPage = previewPage === "page" && !!pageId && !!vendorData && !embeddedSelectedPage;
  const { data: termsData, isLoading: isTermsLoading } = useVendorTerms(shouldFetchTerms);
  const { data: privacyData, isLoading: isPrivacyLoading } = useVendorPrivacy(shouldFetchPrivacy);
  const { data: selectedPageData, isLoading: isPageLoading } = useVendorPage(shouldFetchPage ? pageId : null);

  if (
    isLoading ||
    (shouldFetchTerms && isTermsLoading) ||
    (shouldFetchPrivacy && isPrivacyLoading) ||
    (shouldFetchPage && isPageLoading)
  ) {
    return <Loader />;
  }

  const activeColors = {
    header_color:    searchParams.get("header")    || vendorData?.colors?.header_color    || "#ffffff",
    footer_color:    searchParams.get("footer")    || vendorData?.colors?.footer_color    || "#1e293b",
    primary_color:   searchParams.get("primary")   || vendorData?.colors?.primary_color   || "#2563eb",
    secondary_color: searchParams.get("secondary") || vendorData?.colors?.secondary_color || "#1d4ed8",
    hover_color:     searchParams.get("hover")     || vendorData?.colors?.hover_color     || "#dbeafe",
    text_color:      searchParams.get("text")      || vendorData?.colors?.text_color      || "#1e293b",
  };

  // Augment vendorData with resolved colors, slug, and pages so Header/Footer blocks receive them
  const previewBaseUrl = `/preview?${searchParams.toString()}`;
  const enrichedData = vendorData
    ? {
        ...vendorData,
        colors: activeColors,
        slug: "preview",
        pages: vendorData.pages || [],
        previewBaseUrl,
        terms_content: termsData?.content || vendorData.terms_content || "",
        privacy_content: privacyData?.content || vendorData.privacy_content || "",
      }
    : null;

  // Combined blocks mode (admin theme builder variant picker)
  const blocksParam = searchParams.get("blocks");
  if (blocksParam) {
    let combinedBlocks: { block_type: string; variant: string; is_visible: boolean }[] = [];
    try { combinedBlocks = JSON.parse(atob(blocksParam)); } catch { combinedBlocks = []; }
    const visibleBlocks = combinedBlocks.filter(b => b.is_visible);
    const headerBlock = visibleBlocks.find(b => b.block_type === "header");
    const footerBlock = visibleBlocks.find(b => b.block_type === "footer");
    const blockData = { ...enrichedData, home_blocks: combinedBlocks };

    if (previewPage === "contact" || previewPage === "terms" || previewPage === "privacy" || previewPage === "page" || previewPage === "login" || previewPage === "register") {
      const middleContent =
        previewPage === "contact" ? (
          <ContactUs data={blockData} />
        ) : previewPage === "terms" ? (
          <TermsConditions data={blockData} />
        ) : previewPage === "page" ? (
          <PreviewCustomPage data={blockData} pageId={pageId} pageData={selectedPageData} />
        ) : previewPage === "login" ? (
          <PublicClientLogin data={blockData} />
        ) : previewPage === "register" ? (
          <PublicClientRegister data={blockData} />
        ) : (
          <PrivacyPolicy data={blockData} />
        );

      return (
        <div className="min-h-screen bg-white p-0 m-0 flex flex-col">
          {headerBlock && (
            <BlockRenderer
              block_type="header"
              visible={true}
              settings={{ variant: headerBlock.variant || "variant_1" }}
              vendorData={blockData}
            />
          )}
          <main key={`preview-${previewPage || "home"}-${pageId || ""}`} className="flex-1">
            {middleContent}
          </main>
          {footerBlock && (
            <BlockRenderer
              block_type="footer"
              visible={true}
              settings={{ variant: footerBlock.variant || "variant_1" }}
              vendorData={blockData}
            />
          )}
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-white p-0 m-0 flex flex-col scroll-smooth">
        {visibleBlocks.map((b, i) => (
          <BlockRenderer
            key={i}
            block_type={b.block_type}
            visible={true}
            settings={{ variant: b.variant || "variant_1" }}
            vendorData={blockData}
          />
        ))}
      </div>
    );
  }

  if (previewPage === "contact" || previewPage === "terms" || previewPage === "privacy" || previewPage === "page" || previewPage === "login" || previewPage === "register") {
    const blockData = enrichedData
      ? { ...enrichedData, home_blocks: enrichedData.home_blocks || [] }
      : null;

    const middleContent =
      previewPage === "contact" ? (
        <ContactUs data={blockData} />
      ) : previewPage === "terms" ? (
        <TermsConditions data={blockData} />
      ) : previewPage === "page" ? (
        <PreviewCustomPage data={blockData} pageId={pageId} pageData={selectedPageData} />
      ) : previewPage === "login" ? (
        <PublicClientLogin data={blockData} />
      ) : previewPage === "register" ? (
        <PublicClientRegister data={blockData} />
      ) : (
        <PrivacyPolicy data={blockData} />
      );

    return (
      <div className="min-h-screen bg-white p-0 m-0 flex flex-col">
        <BlockRenderer
          block_type="header"
          visible={true}
          settings={{ variant: "variant_1" }}
          vendorData={blockData}
        />
        <main key={`preview-${previewPage || "home"}-${pageId || ""}`} className="flex-1">
          {middleContent}
        </main>
        <BlockRenderer
          block_type="footer"
          visible={true}
          settings={{ variant: "variant_1" }}
          vendorData={blockData}
        />
      </div>
    );
  }

  // Single block mode (legacy)
  const blockType = searchParams.get("block");
  const variant   = searchParams.get("variant");
  if (blockType) {
    return (
      <div className="min-h-screen bg-white overflow-hidden p-0 m-0">
        <BlockRenderer
          block_type={blockType}
          visible={true}
          settings={{ variant: variant || "variant_1" }}
          vendorData={enrichedData}
        />
      </div>
    );
  }

  if (!vendorData || !vendorData.theme_id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a]">
        <div className="text-center space-y-2">
          <p className="text-gray-500 font-medium">No active theme set.</p>
          <p className="text-sm text-gray-400">Please select a theme first.</p>
        </div>
      </div>
    );
  }

  const previewThemeId = searchParams.get("themeId")
    ? parseInt(searchParams.get("themeId") as string)
    : vendorData.theme_id;

  return (
    <div className="min-h-screen bg-white">
      <ThemePreview
        themeId={previewThemeId!}
        colors={activeColors as any}
        vendorData={enrichedData ?? undefined}
        isFullPage={true}
      />
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<Loader />}>
      <PreviewContent />
    </Suspense>
  );
}
