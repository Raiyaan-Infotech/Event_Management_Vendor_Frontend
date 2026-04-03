import { ContactViewContent } from "../../_components/contact-view-content";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ContactViewContent id={id} />;
}
