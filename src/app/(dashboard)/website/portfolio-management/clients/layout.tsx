import { BlockGuard } from "@/components/website/block-guard";

export default function PortfolioClientsLayout({ children }: { children: React.ReactNode }) {
  return <BlockGuard blockType="portfolio_clients">{children}</BlockGuard>;
}
