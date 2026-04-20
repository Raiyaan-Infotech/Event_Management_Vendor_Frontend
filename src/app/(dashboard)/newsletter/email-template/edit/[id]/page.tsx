import EmailTemplateForm from "../../_components/email-template-form";

export const metadata = {
  title: "Edit Email Template | Vendor Portal",
  description: "Modify your existing email template.",
};

export default async function EditEmailTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EmailTemplateForm mode="edit" id={id} />;
}
