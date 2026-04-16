import EmailTemplateForm from "../../_components/email-template-form";

export const metadata = {
  title: "View Email Template | Vendor Portal",
  description: "View the details of your email template.",
};

export default async function ViewEmailTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EmailTemplateForm mode="view" id={id} />;
}
