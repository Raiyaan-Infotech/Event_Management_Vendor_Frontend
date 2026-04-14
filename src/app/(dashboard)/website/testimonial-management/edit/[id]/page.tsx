import EditTestimonialContent from "../../_components/edit-testimonial-content";

export const metadata = {
  title: "Edit Testimonial | Vendor Portal",
  description: "Modify existing client feedback entries for your public website.",
};

export default function EditTestimonialPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background transition-all duration-300">
      <EditTestimonialContent id={params.id} />
    </div>
  );
}
