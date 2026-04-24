import { BlockGuard } from "@/components/website/block-guard";

export default function AdvanceSliderLayout({ children }: { children: React.ReactNode }) {
  return <BlockGuard blockType="advance_slider">{children}</BlockGuard>;
}
