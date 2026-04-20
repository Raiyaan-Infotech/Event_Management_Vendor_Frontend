import EmailCategoryForm from "../../_components/email-category-form";

export const metadata = {
  title: "Edit Email Category | Vendor Portal",
  description: "Modify an existing email category.",
};

export default async function EditEmailCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EmailCategoryForm mode="edit" id={id} />;
}
