import { BlockGuard } from "@/components/website/block-guard";

export default function AboutUsLayout({ children }: { children: React.ReactNode }) {
  return <BlockGuard blockType="about_us">{children}</BlockGuard>;
}
