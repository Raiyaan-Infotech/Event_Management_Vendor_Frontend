import { BlockGuard } from "@/components/website/block-guard";

export default function PortfolioEventsLayout({ children }: { children: React.ReactNode }) {
  return <BlockGuard blockType="portfolio_events">{children}</BlockGuard>;
}
