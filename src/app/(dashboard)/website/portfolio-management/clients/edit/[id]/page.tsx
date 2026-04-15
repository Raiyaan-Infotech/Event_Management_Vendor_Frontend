import PortfolioItemsEdit from "../../../_components/portfolio-items-edit";

export const metadata = {
  title: "Edit Client | Vendor Portal",
};

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PortfolioItemsEdit type="client" id={Number(id)} />;
}
