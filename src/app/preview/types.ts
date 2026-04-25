export interface ThemeColors {
  primary_color?: string;
  secondary_color?: string;
  header_color?: string;
  footer_color?: string;
  text_color?: string;
  hover_color?: string;
}

export interface VendorData {
  id: number;
  company_name?: string;
  company_logo?: string;
  short_description?: string;
  about_us?: string;
  company_information?: string;
  company_contact?: string;
  company_email?: string;
  company_address?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  whatsapp?: string;
}

export interface SliderItem {
  id: number;
  type: "basic" | "advanced";
  title: string;
  image_path: string;
  description?: string;
  button_label: string;
  button_color?: string;
  title_color?: string;
  description_color?: string;
  overlay_opacity?: number;
  content_alignment?: "left" | "center" | "right";
}

export interface PortfolioItem {
  id: number;
  type: "client" | "sponsor" | "event";
  image_path?: string;
  label?: string;
  value?: string;
}

export interface GalleryGroup {
  id: number;
  event_name: string;
  city: string;
  images: string[];
  img_view: "public" | "private";
}

export interface TestimonialItem {
  id: number;
  customer_name: string;
  customer_portrait?: string;
  event_name: string;
  client_feedback?: string;
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  price: string | number;
  discounted_price?: string | number;
  features?: string;
  label_color?: string;
}

export interface SocialLinkItem {
  id: number;
  label: string;
  url: string;
  icon?: string | null;
  icon_color?: string | null;
  is_active: number;
  sort_order: number;
}

export interface PreviewData {
  vendor: VendorData;
  sliders: SliderItem[];
  portfolio: {
    clients: PortfolioItem[];
    sponsors: PortfolioItem[];
    events: PortfolioItem[];
  };
  gallery: GalleryGroup[];
  testimonials: TestimonialItem[];
  plans?: SubscriptionPlan[];
  socialLinks?: SocialLinkItem[];
}
