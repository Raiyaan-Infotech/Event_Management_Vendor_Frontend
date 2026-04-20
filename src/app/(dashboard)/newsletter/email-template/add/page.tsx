import EmailTemplateForm from "../_components/email-template-form";

export const metadata = {
  title: "Add Email Template | Vendor Portal",
  description: "Create a new email template for your operations.",
};

export default function AddEmailTemplatePage() {
  return <EmailTemplateForm mode="add" />;
}
