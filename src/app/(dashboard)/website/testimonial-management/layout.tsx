import { BlockGuard } from "@/components/website/block-guard";

export default function TestimonialLayout({ children }: { children: React.ReactNode }) {
  return <BlockGuard blockType="testimonial">{children}</BlockGuard>;
}
