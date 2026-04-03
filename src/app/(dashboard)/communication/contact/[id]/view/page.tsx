import { ContactViewContent } from "../../_components/contact-view-content";

export default function Page({ params }: { params: { id: string } }) {
  return <ContactViewContent id={params.id} />;
}
