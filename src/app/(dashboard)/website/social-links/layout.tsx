import { BlockGuard } from "@/components/website/block-guard";

export default function SocialLinksLayout({ children }: { children: React.ReactNode }) {
  return <BlockGuard blockType="social_media">{children}</BlockGuard>;
}
