import NewsletterManagementContent from "../_components/newsletter-management-content";

export const metadata = {
  title: "Newsletter Subscribers | Vendor Portal",
  description: "Clients with an active plan receiving your newsletter.",
};

export default function SubscribersPage() {
  return <NewsletterManagementContent type="subscribers" />;
}
