import React from "react";
import { notFound } from "next/navigation";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import { getPublicVendorData } from "@/lib/public-vendor-data";
import { buildPublicVendorBundle, publicColorStyle, visiblePublicBlocks } from "./_components/PublicVendorShell";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 30;

export default async function PublicVendorHomePage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getPublicVendorData(slug);

  if (!data) notFound();

  const vendorBundle = buildPublicVendorBundle(data, slug);
  const visibleBlocks = visiblePublicBlocks(data);

  const headerBlock = visibleBlocks.find((b) => b.block_type === "header");
  const footerBlock = visibleBlocks.find((b) => b.block_type === "footer");
  const middleBlocks = visibleBlocks.filter(
    (b) => b.block_type !== "header" && b.block_type !== "footer",
  );

  return (
    <div style={publicColorStyle(data.colors)} className="flex min-h-screen flex-col bg-white">
      {headerBlock && (
        <BlockRenderer
          block_type="header"
          visible={true}
          settings={{ variant: headerBlock.variant || "variant_1" }}
          vendorData={vendorBundle}
        />
      )}

      <main className="flex-1">
        {middleBlocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 px-4 py-32 text-center">
            <h2 className="text-3xl font-bold text-gray-800">{data.vendor.company_name}</h2>
            {data.vendor.short_description && (
              <p className="max-w-xl text-gray-500">{data.vendor.short_description}</p>
            )}
          </div>
        ) : (
          middleBlocks.map((block, index) => (
            <BlockRenderer
              key={`${block.block_type}-${index}`}
              block_type={block.block_type}
              visible={true}
              settings={{ variant: block.variant || "variant_1" }}
              vendorData={vendorBundle}
            />
          ))
        )}
      </main>

      {footerBlock && (
        <BlockRenderer
          block_type="footer"
          visible={true}
          settings={{ variant: footerBlock.variant || "variant_1" }}
          vendorData={vendorBundle}
        />
      )}
    </div>
  );
}
