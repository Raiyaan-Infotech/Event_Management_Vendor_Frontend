import type { Metadata } from "next";
import { getPublicVendorData } from "@/lib/public-vendor-data";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Pick<LayoutProps, "params">): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPublicVendorData(slug);
  const vendor = data?.vendor;

  if (!vendor) return { title: "Website" };

  return {
    title: vendor.company_name || "Website",
    description: vendor.short_description || vendor.company_information || undefined,
  };
}

export default function PublicWebsiteLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {children}
    </div>
  );
}
