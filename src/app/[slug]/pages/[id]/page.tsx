import React from "react";
import { notFound } from "next/navigation";
import { getPublicVendorData } from "@/lib/public-vendor-data";
import { sanitizeHtml } from "@/lib/sanitize-html";
import PublicVendorShell from "../../_components/PublicVendorShell";

interface PageProps {
  params: Promise<{ slug: string; id: string }>;
}

export const revalidate = 30;

export default async function PublicCustomPage({ params }: PageProps) {
  const { slug, id } = await params;
  const data = await getPublicVendorData(slug);
  if (!data) notFound();

  const pageId = Number(id);
  const page = (data.pages || []).find((item) => item.id === pageId && item.is_active !== 0);
  if (!page) notFound();
  const safeContent = sanitizeHtml(page.content);

  return (
    <PublicVendorShell data={data} slug={slug}>
      <article className="mx-auto max-w-4xl px-6 py-16 md:px-8">
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
      </article>
    </PublicVendorShell>
  );
}
