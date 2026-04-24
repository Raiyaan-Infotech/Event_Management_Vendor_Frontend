import React from "react";
import dynamic from "next/dynamic";

// 1. Dynamic Imports for Performance (Lazy Loading)
// Next.js will ONLY download the component code if the Theme dictates it!
// Replace these paths with your actual physical component paths as you build them.
const SimpleSlider = dynamic(() => import("./SimpleSlider").catch(() => () => <Placeholder name="Simple Slider" />));
const AdvanceSlider = dynamic(() => import("./AdvanceSlider").catch(() => () => <Placeholder name="Advance Slider" />));
const AboutUs = dynamic(() => import("./AboutUs").catch(() => () => <Placeholder name="About Us" />));
const PortfolioClients = dynamic(() => import("./PortfolioClients").catch(() => () => <Placeholder name="Portfolio Clients" />));
const PortfolioSponsors = dynamic(() => import("./PortfolioSponsors").catch(() => () => <Placeholder name="Portfolio Sponsors" />));
const PortfolioEvents = dynamic(() => import("./PortfolioEvents").catch(() => () => <Placeholder name="Portfolio Events" />));
const Gallery = dynamic(() => import("./Gallery").catch(() => () => <Placeholder name="Gallery" />));
const Testimonial = dynamic(() => import("./Testimonial").catch(() => () => <Placeholder name="Testimonial" />));
const SubscriptionPlans = dynamic(() => import("./SubscriptionPlans").catch(() => () => <Placeholder name="Subscription Plans" />));

function Placeholder({ name }: { name: string }) {
  return (
    <div className="w-full h-32 border-2 border-dashed border-muted bg-muted/20 flex flex-col items-center justify-center text-muted-foreground my-4">
      <p className="text-sm font-semibold">{name} Component</p>
      <p className="text-xs">Component file not found or still in development.</p>
    </div>
  );
}

export interface BlockRendererProps {
  block_type: string;
  visible: boolean;
  settings?: Record<string, any>;
  vendorData?: any; // The raw data payload from the API representing the vendor stats/images
}

export default function BlockRenderer({ block_type, visible, settings, vendorData }: BlockRendererProps) {
  // If the admin hid this block in the Theme Builder, skip rendering entirely!
  if (!visible) return null;

  // The Switch Statement maps the Database String to the React Code
  // And passes the *Variant Settings* + *Real Vendor Data* down to the component.
  switch (block_type) {
    case "simple_slider":
      return <SimpleSlider data={vendorData} settings={settings} />;
      
    case "advance_slider":
      return <AdvanceSlider data={vendorData} settings={settings} />;
      
    case "about_us":
      return <AboutUs data={vendorData} settings={settings} />;
      
    case "portfolio_clients":
      return <PortfolioClients data={vendorData} settings={settings} />;
      
    case "portfolio_sponsors":
      return <PortfolioSponsors data={vendorData} settings={settings} />;
      
    case "portfolio_events":
      return <PortfolioEvents data={vendorData} settings={settings} />;
      
    case "gallery":
      return <Gallery data={vendorData} settings={settings} />;
      
    case "testimonial":
      return <Testimonial data={vendorData} settings={settings} />;
      
    case "subscription":
      return <SubscriptionPlans data={vendorData} settings={settings} />;

    default:
      // Graceful fallback for unmapped or new blocks
      return (
        <div className="w-full p-4 border border-red-500/50 bg-red-500/10 text-red-600 text-center text-xs my-2 rounded">
           Unrecognized Block Type: {block_type}
        </div>
      );
  }
}
