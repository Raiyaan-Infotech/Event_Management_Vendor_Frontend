import AddTestimonialContent from "../_components/add-testimonial-content";

export const metadata = {
  title: "Add Testimonial | Vendor Portal",
  description: "Create a new client feedback entry for your public website.",
};

export default function AddTestimonialPage() {
  return (
    <div className="min-h-screen bg-background transition-all duration-300">
      <AddTestimonialContent />
    </div>
  );
}
