import PortfolioItemsEdit from "../../../_components/portfolio-items-edit";

export const metadata = {
  title: "Edit Sponsor | Vendor Portal",
};

export default async function EditSponsorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PortfolioItemsEdit type="sponsor" id={Number(id)} />;
}
