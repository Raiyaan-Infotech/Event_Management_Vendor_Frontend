import { BlockGuard } from "@/components/website/block-guard";

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <BlockGuard blockType="gallery">{children}</BlockGuard>;
}
