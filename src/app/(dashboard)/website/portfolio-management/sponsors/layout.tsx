import { BlockGuard } from "@/components/website/block-guard";

export default function PortfolioSponsorsLayout({ children }: { children: React.ReactNode }) {
  return <BlockGuard blockType="portfolio_sponsors">{children}</BlockGuard>;
}
