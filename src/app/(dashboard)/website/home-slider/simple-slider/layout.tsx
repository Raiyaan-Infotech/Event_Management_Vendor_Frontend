import { BlockGuard } from "@/components/website/block-guard";

export default function SimpleSliderLayout({ children }: { children: React.ReactNode }) {
  return <BlockGuard blockType="simple_slider">{children}</BlockGuard>;
}
