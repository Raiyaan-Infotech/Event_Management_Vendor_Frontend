import NewsletterManagementContent from "../_components/newsletter-management-content";

export const metadata = {
  title: "Newsletter Unsubscribers | Vendor Portal",
  description: "Clients with no active plan — not receiving newsletter.",
};

export default function UnSubscribersPage() {
  return <NewsletterManagementContent type="unsubscribers" />;
}
