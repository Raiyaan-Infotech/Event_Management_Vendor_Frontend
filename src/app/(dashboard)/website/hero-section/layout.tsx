import { BlockGuard } from "@/components/website/block-guard";

export default function HeroSectionLayout({ children }: { children: React.ReactNode }) {
  return <BlockGuard blockType="hero_section">{children}</BlockGuard>;
}
