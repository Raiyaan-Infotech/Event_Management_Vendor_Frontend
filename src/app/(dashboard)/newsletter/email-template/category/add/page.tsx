import EmailCategoryForm from "../_components/email-category-form";

export const metadata = {
  title: "Add Email Category | Vendor Portal",
  description: "Create a new email template category.",
};

export default function AddEmailCategoryPage() {
  return <EmailCategoryForm mode="add" />;
}
