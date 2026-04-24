import { BlockGuard } from "@/components/website/block-guard";

export default function SubscriptionLayout({ children }: { children: React.ReactNode }) {
  return <BlockGuard blockType="subscription">{children}</BlockGuard>;
}
