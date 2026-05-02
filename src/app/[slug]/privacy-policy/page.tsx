import React from "react";
import { notFound } from "next/navigation";
import PrivacyPolicy from "@/components/blocks/PrivacyPolicy";
import { getPublicVendorData } from "@/lib/public-vendor-data";
import PublicVendorShell, { buildPublicVendorBundle } from "../_components/PublicVendorShell";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 30;

export default async function PublicPrivacyPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getPublicVendorData(slug);
  if (!data) notFound();

  const vendorBundle = buildPublicVendorBundle(data, slug);

  return (
    <PublicVendorShell data={data} slug={slug}>
      <PrivacyPolicy data={vendorBundle} />
    </PublicVendorShell>
  );
}
