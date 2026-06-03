"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Image as ImageIcon, Edit, Sparkles, Upload, X, RotateCcw, Layout, Check, Play, ArrowRight } from "lucide-react";
import { cn, resolveMediaUrl } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useVendorAbout } from "@/hooks/use-vendors";
import { useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { PersistenceActions } from "@/components/common/PersistenceActions";
import { ImageCropper } from "@/components/common/ImageCropper";
import { WebsiteSettingsPageSkeleton } from "@/components/boneyard/website-settings-page-skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVendorPages } from "@/hooks/use-vendor-pages";
import { useVendorPreviewData } from "@/hooks/use-vendor-preview";
import { useVendorColors } from "@/hooks/use-vendor-colors";
import { useSaveVendorHeroSection, useVendorHeroSection } from "@/hooks/use-vendor-hero-section";
import { normalizeHomeBlocks } from "@/lib/safe-json";

// Import central defaults
import { HERO_DEFAULTS } from "@/components/blocks/HeroSection";

const VARIANTS_LIST = [
  { id: "variant_1", label: "Classic Premium", desc: "Side grid with dynamic colored paint splash overlay", icon: "🎨" },
  { id: "variant_2", label: "EventPress Center", desc: "Full-bleed background overlay with centered clean typography", icon: "✨" },
  { id: "variant_3", label: "Smart Study Layout", desc: "Soft yellow mesh BG, left-aligned search bar & cutout person with doodle arrow", icon: "🎓" },
  { id: "variant_4", label: "Dark Luxury Stats Layout", desc: "Sophisticated charcoal banner with gold/purple glows, custom metrics cards & highlighted titles", icon: "💎" },
  { id: "variant_5", label: "Stress-Free Events Layout", desc: "Vibrant yellow BG with organic shapes, social buttons & cutout lady", icon: "🎉" },
  { id: "variant_6", label: "Widescreen Left-Aligned Layout", desc: "Full-bleed background image with modern left-aligned typography", icon: "⛰️" },
  { id: "variant_7", label: "Widescreen Center-Aligned Layout", desc: "Full-bleed background image with modern center-aligned typography & overlay", icon: "🎯" },
  { id: "variant_8", label: "Widescreen Right-Aligned Layout", desc: "Full-bleed background image with modern right-aligned typography & overlay", icon: "🌅" },
  { id: "variant_9", label: "Widescreen Left-Aligned (with Button)", desc: "Full-bleed background image, left-aligned typography with Call to Action button", icon: "⛰️" },
  { id: "variant_10", label: "Widescreen Center-Aligned (with Button)", desc: "Full-bleed background image, center-aligned typography with Call to Action button", icon: "🎯" },
  { id: "variant_11", label: "Widescreen Right-Aligned (with Button)", desc: "Full-bleed background image, right-aligned typography with Call to Action button", icon: "🌅" },
  { id: "variant_12", label: "Widescreen Left-Aligned (with 2 Buttons)", desc: "Full-bleed background image, left-aligned typography with 2 Call to Action buttons", icon: "⛰️" },
  { id: "variant_13", label: "Widescreen Center-Aligned (with 2 Buttons)", desc: "Full-bleed background image, center-aligned typography with 2 Call to Action buttons", icon: "🎯" },
  { id: "variant_14", label: "Widescreen Right-Aligned (with 2 Buttons)", desc: "Full-bleed background image, right-aligned typography with 2 Call to Action buttons", icon: "🌅" },
  { id: "variant_15", label: "Widescreen Left-Aligned Layout (No Title)", desc: "Full-bleed background image with left-aligned typography, without title eyebrow", icon: "⛰️" },
  { id: "variant_16", label: "Widescreen Center-Aligned Layout (No Title)", desc: "Full-bleed background image with center-aligned typography, without title eyebrow", icon: "🎯" },
  { id: "variant_17", label: "Widescreen Right-Aligned Layout (No Title)", desc: "Full-bleed background image with right-aligned typography, without title eyebrow", icon: "🌅" },
  { id: "variant_18", label: "Widescreen Left-Aligned (No Title, with Button)", desc: "Full-bleed background image, left-aligned typography without title eyebrow, with Call to Action button", icon: "⛰️" },
  { id: "variant_19", label: "Widescreen Center-Aligned (No Title, with Button)", desc: "Full-bleed background image, center-aligned typography without title eyebrow, with Call to Action button", icon: "🎯" },
  { id: "variant_20", label: "Widescreen Right-Aligned (No Title, with Button)", desc: "Full-bleed background image, right-aligned typography without title eyebrow, with Call to Action button", icon: "🌅" },
  { id: "variant_21", label: "Widescreen Left-Aligned (No Title, with 2 Buttons)", desc: "Full-bleed background image, left-aligned typography without title eyebrow, with 2 Call to Action buttons", icon: "⛰️" },
  { id: "variant_22", label: "Widescreen Center-Aligned (No Title, with 2 Buttons)", desc: "Full-bleed background image, center-aligned typography without title eyebrow, with 2 Call to Action buttons", icon: "🎯" },
  { id: "variant_23", label: "Widescreen Right-Aligned (No Title, with 2 Buttons)", desc: "Full-bleed background image, right-aligned typography without title eyebrow, with 2 Call to Action buttons", icon: "🌅" },

];

export default function HeroSectionPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: vendor, isLoading } = useVendorAbout();
  const { data: previewData } = useVendorPreviewData();
  const { data: pagesData } = useVendorPages({ limit: 100 });
  const { data: colorData } = useVendorColors();
  const { data: heroSection, isLoading: heroLoading } = useVendorHeroSection();
  const saveHeroSection = useSaveVendorHeroSection();

  // State fields
  const [title, setTitle] = useState("");
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [button, setButton] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [bgImageUrl, setBgImageUrl] = useState("");
  const [pageId, setPageId] = useState<number | null>(null);
  const [button2, setButton2] = useState("");
  const [pageId2, setPageId2] = useState<number | null>(null);
  const [variant, setVariant] = useState("variant_1");

  // Variant 4 Custom Stats state fields
  const [stat1Val, setStat1Val] = useState("");
  const [stat1Lbl, setStat1Lbl] = useState("");
  const [stat1Sub, setStat1Sub] = useState("");

  const [stat2Val, setStat2Val] = useState("");
  const [stat2Lbl, setStat2Lbl] = useState("");
  const [stat2Sub, setStat2Sub] = useState("");

  const [stat3Val, setStat3Val] = useState("");
  const [stat3Lbl, setStat3Lbl] = useState("");
  const [stat3Sub, setStat3Sub] = useState("");

  const [cropperOpen, setCropperOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeUploadField, setActiveUploadField] = useState<"main" | "bg">("main");

  const pages = pagesData?.data ?? [];

  const isWidescreen = ["variant_2", "variant_3", "variant_4", "variant_5", "variant_6", "variant_7", "variant_8", "variant_9", "variant_10", "variant_11", "variant_12", "variant_13", "variant_14", "variant_15", "variant_16", "variant_17", "variant_18", "variant_19", "variant_20", "variant_21","variant_22","variant_23"].includes(variant);
  const isDualUpload = variant === "variant_3" || variant === "variant_5";
  const cropperAspect = isDualUpload
    ? (activeUploadField === "bg" ? 16 / 9 : 0.8)
    : (isWidescreen ? 16 / 9 : 0.8);
  const cropperWidth = isDualUpload
    ? (activeUploadField === "bg" ? 1920 : 800)
    : (isWidescreen ? 1920 : 800);
  const cropperHeight = isDualUpload
    ? (activeUploadField === "bg" ? 1080 : 1000)
    : (isWidescreen ? 1080 : 1000);

  // Load the saved DB content for the server-selected hero variant.
  useEffect(() => {
    if (!vendor) return;

    // Determine the active variant from Admin builder selection, then saved hero row.
    const homeBlocks = previewData?.home_blocks ? normalizeHomeBlocks(previewData.home_blocks) : [];
    const heroBlock = homeBlocks.find(b => b.block_type === "hero_section" || b.block_type === "Hero Section");
    const activeVariant = heroBlock?.variant || heroSection?.variant || "variant_1";

    setVariant(activeVariant);

    const defaults = (HERO_DEFAULTS as any)[activeVariant] || HERO_DEFAULTS.variant_1;

    const stored = heroSection?.variant === activeVariant ? JSON.stringify(heroSection) : null;
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        
        // Only load customization if it was saved for the active variant
        if (parsed.variant === activeVariant) {
          let loadedTitle = parsed.title;
          let loadedHeading = parsed.heading;
          let loadedDesc = parsed.description;
          let loadedBtn = parsed.button;
          let loadedImg = parsed.image_url;
          let loadedBg = parsed.bg_image_url;

          setTitle((loadedTitle !== undefined && loadedTitle !== null && loadedTitle !== "") ? loadedTitle : (defaults.title || ""));
          setHeading((loadedHeading !== undefined && loadedHeading !== null && loadedHeading !== "") ? loadedHeading : (defaults.heading || ""));
          setDescription((loadedDesc !== undefined && loadedDesc !== null && loadedDesc !== "") ? loadedDesc : (defaults.description || ""));
          setButton((loadedBtn !== undefined && loadedBtn !== null && loadedBtn !== "") ? loadedBtn : (defaults.button || ""));
          setButton2((parsed.button2 !== undefined && parsed.button2 !== null && parsed.button2 !== "") ? parsed.button2 : (defaults.button2 || ""));
          setImageUrl((loadedImg !== undefined && loadedImg !== null && loadedImg !== "") ? loadedImg : (defaults.image_url || ""));
          setBgImageUrl(loadedBg !== undefined ? loadedBg : (defaults.bg_image_url || ""));
          setPageId(parsed.page_id !== undefined ? parsed.page_id : null);
          setPageId2(parsed.page_id2 !== undefined ? parsed.page_id2 : null);

          setStat1Val(parsed.stat1_val !== undefined ? parsed.stat1_val : (defaults.stat1_val || ""));
          setStat1Lbl(parsed.stat1_lbl !== undefined ? parsed.stat1_lbl : (defaults.stat1_lbl || ""));
          setStat1Sub(parsed.stat1_sub !== undefined ? parsed.stat1_sub : (defaults.stat1_sub || ""));

          setStat2Val(parsed.stat2_val !== undefined ? parsed.stat2_val : (defaults.stat2_val || ""));
          setStat2Lbl(parsed.stat2_lbl !== undefined ? parsed.stat2_lbl : (defaults.stat2_lbl || ""));
          setStat2Sub(parsed.stat2_sub !== undefined ? parsed.stat2_sub : (defaults.stat2_sub || ""));

          setStat3Val(parsed.stat3_val !== undefined ? parsed.stat3_val : (defaults.stat3_val || ""));
          setStat3Lbl(parsed.stat3_lbl !== undefined ? parsed.stat3_lbl : (defaults.stat3_lbl || ""));
          setStat3Sub(parsed.stat3_sub !== undefined ? parsed.stat3_sub : (defaults.stat3_sub || ""));
          return;
        }
      } catch (e) {
        // Fall through
      }
    }

    // Default fallback to active variant's defaults
    setTitle(defaults.title || "");
    setHeading(defaults.heading || "");
    setDescription(defaults.description || "");
    setButton(defaults.button || "");
    setButton2(defaults.button2 || "");
    setImageUrl(defaults.image_url || "");
    setBgImageUrl(defaults.bg_image_url || "");
    setPageId(null);
    setPageId2(null);

    setStat1Val(defaults.stat1_val || "");
    setStat1Lbl(defaults.stat1_lbl || "");
    setStat1Sub(defaults.stat1_sub || "");

    setStat2Val(defaults.stat2_val || "");
    setStat2Lbl(defaults.stat2_lbl || "");
    setStat2Sub(defaults.stat2_sub || "");

    setStat3Val(defaults.stat3_val || "");
    setStat3Lbl(defaults.stat3_lbl || "");
    setStat3Sub(defaults.stat3_sub || "");
  }, [vendor, heroSection, previewData]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "main" | "bg") => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Enforce JPG or PNG format only
    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file format! Please upload only JPG or PNG images.");
      e.target.value = "";
      return;
    }

    // Reject files larger than 5MB
    const FIVE_MB = 5 * 1024 * 1024;
    if (file.size > FIVE_MB) {
      toast.error("Image is too large! Please upload a file smaller than 5MB.");
      e.target.value = "";
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Processing and uploading optimized image...");
    try {
      // 1. Read file as Data URL
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // 2. Load into an Image object
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new window.Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = dataUrl;
      });

      // 3. Draw onto a Canvas with exact dimensions 1920x1080 (cover fit)
      const targetWidth = 1920;
      const targetHeight = 1080;
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context is unavailable");

      // Calculate position and size to draw with cover fit
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const targetRatio = targetWidth / targetHeight;
      let drawWidth = img.naturalWidth;
      let drawHeight = img.naturalHeight;
      let offsetX = 0;
      let offsetY = 0;

      if (imgRatio > targetRatio) {
        // Image is wider than target aspect ratio
        drawWidth = img.naturalHeight * targetRatio;
        offsetX = (img.naturalWidth - drawWidth) / 2;
      } else {
        // Image is taller than target aspect ratio
        drawHeight = img.naturalWidth / targetRatio;
        offsetY = (img.naturalHeight - drawHeight) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight, 0, 0, targetWidth, targetHeight);

      // 5. Determine correct MIME type
      let mimeType = "image/jpeg";
      if (file.type === "image/webp") {
        mimeType = "image/webp";
      } else if (file.type === "image/png") {
        mimeType = "image/png";
      }

      // 6. Progressive compression loop targeting under 500KB
      let quality = 0.90;
      let compressedDataUrl = canvas.toDataURL(mimeType, quality);
      let sizeInBytes = (compressedDataUrl.length * 3) / 4;
      const TARGET_LIMIT = 500 * 1024; // 500KB

      if (mimeType === "image/jpeg" || mimeType === "image/webp") {
        while (sizeInBytes > TARGET_LIMIT && quality > 0.3) {
          quality -= 0.1;
          compressedDataUrl = canvas.toDataURL(mimeType, quality);
          sizeInBytes = (compressedDataUrl.length * 3) / 4;
        }
      } else if (sizeInBytes > TARGET_LIMIT) {
        // Automatically convert heavy transparent PNGs to highly compressible JPEG to meet the 500KB requirement
        mimeType = "image/jpeg";
        quality = 0.90;
        compressedDataUrl = canvas.toDataURL(mimeType, quality);
        sizeInBytes = (compressedDataUrl.length * 3) / 4;
        while (sizeInBytes > TARGET_LIMIT && quality > 0.3) {
          quality -= 0.1;
          compressedDataUrl = canvas.toDataURL(mimeType, quality);
          sizeInBytes = (compressedDataUrl.length * 3) / 4;
        }
      }

      // 7. Convert base64 DataURL back to a Blob
      const blob = await fetch(compressedDataUrl).then((r) => r.blob());

      // 8. Prepare FormData
      const fd = new FormData();
      const ext = mimeType === "image/jpeg" ? ".jpg" : mimeType === "image/webp" ? ".webp" : ".png";
      const newFileName = file.name.replace(/\.[^/.]+$/, "") + ext;
      fd.append("file", new File([blob], newFileName, { type: mimeType }));
      fd.append("folder", "vendors");

      // 9. Send upload request to backend
      const res = await apiClient.post("/vendors/auth/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const url = res.data.data?.file?.url || res.data.data?.url;
      if (url) {
        if (field === "bg") {
          setBgImageUrl(url);
          toast.success("Background image optimized & uploaded!", { id: toastId });
        } else {
          setImageUrl(url);
          toast.success("Hero image optimized & uploaded!", { id: toastId });
        }
      } else {
        throw new Error("Invalid response from server upload");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to automatically optimize and upload image.", { id: toastId });
    } finally {
      setIsSubmitting(false);
      e.target.value = "";
    }
  };

  const handleCropComplete = async (croppedBase64: string) => {
    setCropperOpen(false);
    setImageToCrop("");
    setIsSubmitting(true);
    try {
      const blob = await fetch(croppedBase64).then((r) => r.blob());
      const fd = new FormData();
      fd.append("file", new File([blob], "hero.jpg", { type: "image/jpeg" }));
      fd.append("folder", "vendors");
      const res = await apiClient.post("/vendors/auth/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data.data?.file?.url || res.data.data?.url;
      if (url) {
        if (activeUploadField === "bg") {
          setBgImageUrl(url);
          toast.success("Background image cropped and uploaded successfully!");
        } else {
          setImageUrl(url);
          toast.success("Hero image cropped and uploaded successfully!");
        }
      }
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        title,
        heading,
        description,
        button,
        button2,
        image_url: imageUrl,
        bg_image_url: bgImageUrl,
        page_id: pageId,
        page_id2: pageId2,
        variant,
        // Include variant 4 custom stats
        stat1_val: stat1Val,
        stat1_lbl: stat1Lbl,
        stat1_sub: stat1Sub,
        stat2_val: stat2Val,
        stat2_lbl: stat2Lbl,
        stat2_sub: stat2Sub,
        stat3_val: stat3Val,
        stat3_lbl: stat3Lbl,
        stat3_sub: stat3Sub,
      };
      await saveHeroSection.mutateAsync(payload);
      
      // Invalidate the preview data query to trigger direct reactivity
      queryClient.invalidateQueries({ queryKey: ["vendor-preview-data"] });
      
      toast.success("Hero section layout settings updated!");
      setIsEditing(false);
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    // Default fallback to active variant's defaults
    const defaults = (HERO_DEFAULTS as any)[variant] || HERO_DEFAULTS.variant_1;
    setTitle(defaults.title || "");
    setHeading(defaults.heading || "");
    setDescription(defaults.description || "");
    setButton(defaults.button || "");
    setButton2(defaults.button2 || "");
    setImageUrl(defaults.image_url || "");
    setBgImageUrl(defaults.bg_image_url || "");
    setPageId(null);
    setPageId2(null);

    setStat1Val(defaults.stat1_val || "");
    setStat1Lbl(defaults.stat1_lbl || "");
    setStat1Sub(defaults.stat1_sub || "");
    setStat2Val(defaults.stat2_val || "");
    setStat2Lbl(defaults.stat2_lbl || "");
    setStat2Sub(defaults.stat2_sub || "");
    setStat3Val(defaults.stat3_val || "");
    setStat3Lbl(defaults.stat3_lbl || "");
    setStat3Sub(defaults.stat3_sub || "");

    toast.info("All fields reset to active template defaults.");
  };

  const applyTemplateDefaults = (variantId: string) => {
    const defaults = (HERO_DEFAULTS as any)[variantId] || HERO_DEFAULTS.variant_1;
    setTitle(defaults.title || "");
    setHeading(defaults.heading || "");
    setDescription(defaults.description || "");
    setButton(defaults.button || "");
    setButton2(defaults.button2 || "");
    setImageUrl(defaults.image_url || "");
    setBgImageUrl(defaults.bg_image_url || "");

    setStat1Val(defaults.stat1_val || "");
    setStat1Lbl(defaults.stat1_lbl || "");
    setStat1Sub(defaults.stat1_sub || "");
    setStat2Val(defaults.stat2_val || "");
    setStat2Lbl(defaults.stat2_lbl || "");
    setStat2Sub(defaults.stat2_sub || "");
    setStat3Val(defaults.stat3_val || "");
    setStat3Lbl(defaults.stat3_lbl || "");
    setStat3Sub(defaults.stat3_sub || "");

    toast.success(`Applied defaults for ${VARIANTS_LIST.find(v => v.id === variantId)?.label}!`);
  };

  const handleVariantChange = (newVariantId: string) => {
    if (!isEditing) return;
    
    // Detect if current form states are still matches to the previous variant's defaults, 
    // or if they are entirely blank. If so, auto-prefill with the new variant's defaults
    const prevDefaults = (HERO_DEFAULTS as any)[variant] || HERO_DEFAULTS.variant_1;
    const currentValuesUntouched = 
      (title === "" || title === prevDefaults.title) &&
      (heading === "" || heading === prevDefaults.heading) &&
      (description === "" || description === prevDefaults.description) &&
      (button === "" || button === prevDefaults.button) &&
      (button2 === "" || button2 === (prevDefaults.button2 || "")) &&
      (imageUrl === "" || imageUrl === prevDefaults.image_url) &&
      (bgImageUrl === "" || bgImageUrl === (prevDefaults.bg_image_url || ""));

    setVariant(newVariantId);

    if (currentValuesUntouched) {
      const nextDefaults = (HERO_DEFAULTS as any)[newVariantId] || HERO_DEFAULTS.variant_1;
      setTitle(nextDefaults.title || "");
      setHeading(nextDefaults.heading || "");
      setDescription(nextDefaults.description || "");
      setButton(nextDefaults.button || "");
      setButton2(nextDefaults.button2 || "");
      setImageUrl(nextDefaults.image_url || "");
      setBgImageUrl(nextDefaults.bg_image_url || "");

      setStat1Val(nextDefaults.stat1_val || "");
      setStat1Lbl(nextDefaults.stat1_lbl || "");
      setStat1Sub(nextDefaults.stat1_sub || "");
      setStat2Val(nextDefaults.stat2_val || "");
      setStat2Lbl(nextDefaults.stat2_lbl || "");
      setStat2Sub(nextDefaults.stat2_sub || "");
      setStat3Val(nextDefaults.stat3_val || "");
      setStat3Lbl(nextDefaults.stat3_lbl || "");
      setStat3Sub(nextDefaults.stat3_sub || "");

      toast.info(`Switched to ${VARIANTS_LIST.find(v => v.id === newVariantId)?.label}.`);
    } else {
      toast.info(`Switched to ${VARIANTS_LIST.find(v => v.id === newVariantId)?.label}. (Custom texts retained)`);
    }
  };

  const renderLivePreviewContent = () => {
    const previewBgImage = isDualUpload ? bgImageUrl : imageUrl;
    const resolvedBg = previewBgImage ? resolveMediaUrl(previewBgImage) : "";
    const primaryColor = colorData?.merged?.primary_color || "#4f46e5";

    return (
      <div className="relative aspect-[16/9] bg-slate-900 rounded-sm overflow-hidden flex items-center justify-center border border-slate-100 dark:border-slate-800 select-none w-full">
        {/* Resolution Overlay Badge */}
        <div className="absolute top-2 left-2 z-20 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[8px] font-mono tracking-wider">
          1920 × 1080 px
        </div>

        {resolvedBg ? (
          <Image src={resolvedBg} alt="Preview" fill className="object-cover opacity-90" unoptimized />
        ) : (
          <div className="flex flex-col items-center gap-2 z-10">
            <ImageIcon className="w-8 h-8 text-slate-500 opacity-50 animate-pulse" />
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-tight">No Background Selected</span>
          </div>
        )}

        {/* Dynamic Styles based on variant */}
        {variant === "variant_1" && (
          <div className="absolute inset-0 z-10 flex flex-col justify-center text-left p-4 text-white">
            <div className="absolute inset-0 bg-slate-950/40 z-0" />
            <div className="relative z-10 max-w-[80%] space-y-1">
              {title && (
                <span className="text-[6px] font-extrabold uppercase tracking-wider block" style={{ color: primaryColor }}>
                  {title}
                </span>
              )}
              <h3 className="text-[9px] font-black uppercase tracking-tight leading-tight line-clamp-2">
                {heading}
              </h3>
              <p className="text-[6px] opacity-80 line-clamp-2 leading-normal">
                {description}
              </p>
              <div className="flex gap-1 pt-1">
                {button && (
                  <span className="px-2 py-0.5 text-[4px] font-extrabold uppercase tracking-wider rounded-full text-white" style={{ backgroundColor: primaryColor }}>
                    {button}
                  </span>
                )}
                {button2 && (
                  <span className="px-2 py-0.5 text-[4px] font-extrabold uppercase tracking-wider rounded-full border border-white/40 text-white bg-transparent">
                    {button2}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {variant === "variant_2" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-4 text-white">
            <div className="absolute inset-0 bg-black/55 z-0" />
            <div className="relative z-10 max-w-[85%] space-y-1">
              {title && (
                <span className="text-[6px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-sm inline-block text-white" style={{ backgroundColor: primaryColor }}>
                  {title}
                </span>
              )}
              <h3 className="text-[9px] font-black uppercase tracking-tight leading-tight line-clamp-2">
                {heading}
              </h3>
              <p className="text-[6px] text-slate-200 line-clamp-2 leading-normal">
                {description}
              </p>
              {button && (
                <div className="pt-1">
                  <span className="px-3 py-0.5 text-[4px] font-extrabold uppercase tracking-wider rounded-sm text-white inline-block" style={{ backgroundColor: primaryColor }}>
                    {button}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {variant === "variant_3" && (
          <div className="absolute inset-0 z-10 grid grid-cols-12 items-center p-3 text-slate-800">
            <div className="absolute inset-0 bg-white/70 z-0" />
            <div className="col-span-8 space-y-1 relative z-10">
              {title && (
                <span className="text-[6px] font-extrabold uppercase tracking-wider block" style={{ color: primaryColor }}>
                  {title}
                </span>
              )}
              <h3 className="text-[9px] font-black tracking-tight leading-tight line-clamp-2 text-[#181e4b]">
                {heading}
              </h3>
              <p className="text-[6px] text-slate-500 line-clamp-2 leading-normal">
                {description}
              </p>
              {button && (
                <div className="pt-1">
                  <span className="px-2 py-0.5 text-[4px] font-extrabold uppercase tracking-wider rounded-md text-white inline-flex items-center gap-0.5" style={{ backgroundColor: primaryColor }}>
                    {button} →
                  </span>
                </div>
              )}
            </div>
            {imageUrl && (
              <div className="col-span-4 relative h-full flex items-center justify-center z-10">
                <img src={resolveMediaUrl(imageUrl)} alt="" className="object-contain max-h-[85%] max-w-full drop-shadow-md" />
              </div>
            )}
          </div>
        )}

        {variant === "variant_4" && (
          <div className="absolute inset-0 z-10 flex flex-col justify-center text-left p-4 text-white">
            <div className="absolute inset-0 bg-black/45 z-0" />
            <div className="relative z-10 max-w-[90%] space-y-1">
              {title && (
                <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border border-white/20 bg-white/10 text-[5px] font-extrabold uppercase tracking-wider">
                  <Sparkles size={6} className="text-amber-400" />
                  <span style={{ color: primaryColor }}>{title}</span>
                </div>
              )}
              <h3 className="text-[9px] font-black uppercase tracking-tight leading-tight line-clamp-1">
                {heading}
              </h3>
              <p className="text-[5px] opacity-80 line-clamp-1 leading-normal">
                {description}
              </p>
              {/* Mini stats row */}
              <div className="grid grid-cols-3 gap-1 py-1">
                <div className="bg-black/50 border border-white/10 rounded px-1 py-0.5 text-center">
                  <span className="text-[6px] font-extrabold block text-white">{stat1Val}</span>
                  <span className="text-[4px] text-white/60 block truncate">{stat1Lbl}</span>
                </div>
                <div className="bg-black/50 border border-white/10 rounded px-1 py-0.5 text-center">
                  <span className="text-[6px] font-extrabold block text-white">{stat2Val}</span>
                  <span className="text-[4px] text-white/60 block truncate">{stat2Lbl}</span>
                </div>
                <div className="bg-black/50 border border-white/10 rounded px-1 py-0.5 text-center">
                  <span className="text-[6px] font-extrabold block text-white">{stat3Val}</span>
                  <span className="text-[4px] text-white/60 block truncate">{stat3Lbl}</span>
                </div>
              </div>
              {button && (
                <span className="inline-block px-2 py-0.5 text-[4px] font-extrabold uppercase tracking-wider rounded text-white" style={{ backgroundColor: primaryColor }}>
                  {button}
                </span>
              )}
            </div>
          </div>
        )}

        {variant === "variant_5" && (
          <div className="absolute inset-0 z-10 grid grid-cols-12 items-center p-3 text-slate-800">
            <div className="absolute inset-0 bg-[#f3c623]/75 z-0" />
            {imageUrl && (
              <div className="col-span-5 relative h-full flex items-center justify-center z-10">
                <img src={resolveMediaUrl(imageUrl)} alt="" className="object-contain max-h-[85%] max-w-full drop-shadow-md scale-110" />
              </div>
            )}
            <div className="col-span-7 space-y-1 relative z-10 pl-2">
              {title && (
                <span className="text-[6px] font-extrabold uppercase tracking-wider block" style={{ color: primaryColor }}>
                  {title}
                </span>
              )}
              <h3 className="text-[9px] font-black tracking-tight leading-tight line-clamp-2 text-[#181e4b]">
                {heading}
              </h3>
              <p className="text-[6px] text-slate-600 line-clamp-2 leading-normal">
                {description}
              </p>
              {button && (
                <div className="pt-1">
                  <span className="px-2 py-0.5 text-[4px] font-extrabold uppercase tracking-wider rounded-2xl text-white inline-flex items-center gap-0.5" style={{ backgroundColor: primaryColor }}>
                    {button} →
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {variant === "variant_6" && (
          <div className="absolute inset-0 z-10 flex flex-col justify-center text-left p-4 text-white">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-transparent z-0" />
            <div className="relative z-10 max-w-[80%] space-y-1">
              {title && (
                <span className="text-[6px] font-extrabold uppercase tracking-wider block" style={{ color: primaryColor }}>
                  {title}
                </span>
              )}
              <h3 className="text-[9px] font-black uppercase tracking-tight leading-tight line-clamp-2 text-white">
                {heading}
              </h3>
              <p className="text-[6px] text-slate-200 line-clamp-2 leading-normal">
                {description}
              </p>
            </div>
          </div>
        )}

        {variant === "variant_7" && (
          <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center p-4 text-white">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/80 to-slate-950/95 z-0" />
            <div className="relative z-10 max-w-[80%] space-y-1">
              {title && (
                <span className="text-[6px] font-extrabold uppercase tracking-wider block" style={{ color: primaryColor }}>
                  {title}
                </span>
              )}
              <h3 className="text-[9px] font-black uppercase tracking-tight leading-tight line-clamp-2 text-white">
                {heading}
              </h3>
              <p className="text-[6px] text-slate-200 line-clamp-2 leading-normal">
                {description}
              </p>
            </div>
          </div>
        )}

        {variant === "variant_8" && (
          <div className="absolute inset-0 z-10 flex flex-col justify-center items-end text-right p-4 text-white">
            <div className="absolute inset-0 bg-gradient-to-l from-slate-950/90 via-slate-950/65 to-transparent z-0" />
            <div className="relative z-10 max-w-[80%] space-y-1">
              {title && (
                <span className="text-[6px] font-extrabold uppercase tracking-wider block" style={{ color: primaryColor }}>
                  {title}
                </span>
              )}
              <h3 className="text-[9px] font-black uppercase tracking-tight leading-tight line-clamp-2 text-white">
                {heading}
              </h3>
              <p className="text-[6px] text-slate-200 line-clamp-2 leading-normal">
                {description}
              </p>
            </div>
          </div>
        )}

        {variant === "variant_9" && (
          <div className="absolute inset-0 z-10 flex flex-col justify-center text-left p-4 text-white">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-transparent z-0" />
            <div className="relative z-10 max-w-[80%] space-y-1">
              {title && (
                <span className="text-[6px] font-extrabold uppercase tracking-wider block" style={{ color: primaryColor }}>
                  {title}
                </span>
              )}
              <h3 className="text-[9px] font-black uppercase tracking-tight leading-tight line-clamp-2 text-white">
                {heading}
              </h3>
              <p className="text-[6px] text-slate-200 line-clamp-2 leading-normal">
                {description}
              </p>
              {button && (
                <div className="pt-1">
                  <span className="px-2 py-0.5 text-[4px] font-extrabold uppercase tracking-wider rounded-full text-white inline-block animate-fade-in" style={{ backgroundColor: primaryColor }}>
                    {button}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {variant === "variant_10" && (
          <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center p-4 text-white">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-950/90 to-transparent z-0" />
            <div className="relative z-10 max-w-[80%] space-y-1">
              {title && (
                <span className="text-[6px] font-extrabold uppercase tracking-wider block" style={{ color: primaryColor }}>
                  {title}
                </span>
              )}
              <h3 className="text-[9px] font-black uppercase tracking-tight leading-tight line-clamp-2 text-white">
                {heading}
              </h3>
              <p className="text-[6px] text-slate-200 line-clamp-2 leading-normal">
                {description}
              </p>
              {button && (
                <div className="pt-1">
                  <span className="px-2 py-0.5 text-[4px] font-extrabold uppercase tracking-wider rounded-full text-white inline-block animate-fade-in" style={{ backgroundColor: primaryColor }}>
                    {button}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {variant === "variant_11" && (
          <div className="absolute inset-0 z-10 flex flex-col justify-center items-end text-right p-4 text-white">
            <div className="absolute inset-0 bg-gradient-to-l from-slate-950/90 via-slate-950/65 to-transparent z-0" />
            <div className="relative z-10 max-w-[80%] space-y-1">
              {title && (
                <span className="text-[6px] font-extrabold uppercase tracking-wider block" style={{ color: primaryColor }}>
                  {title}
                </span>
              )}
              <h3 className="text-[9px] font-black uppercase tracking-tight leading-tight line-clamp-2 text-white">
                {heading}
              </h3>
              <p className="text-[6px] text-slate-200 line-clamp-2 leading-normal">
                {description}
              </p>
              {button && (
                <div className="pt-1">
                  <span className="px-2 py-0.5 text-[4px] font-extrabold uppercase tracking-wider rounded-full text-white inline-block animate-fade-in" style={{ backgroundColor: primaryColor }}>
                    {button}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {variant === "variant_12" && (
          <div className="absolute inset-0 z-10 flex flex-col justify-center text-left p-4 text-white">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-transparent z-0" />
            <div className="relative z-10 max-w-[80%] space-y-1">
              {title && (
                <span className="text-[6px] font-extrabold uppercase tracking-wider block" style={{ color: primaryColor }}>
                  {title}
                </span>
              )}
              <h3 className="text-[9px] font-black uppercase tracking-tight leading-tight line-clamp-2 text-white">
                {heading}
              </h3>
              <p className="text-[6px] text-slate-200 line-clamp-2 leading-normal">
                {description}
              </p>
              <div className="flex gap-1 pt-1">
                {button && (
                  <span className="px-2 py-0.5 text-[4px] font-extrabold uppercase tracking-wider rounded-full text-white inline-block animate-fade-in" style={{ backgroundColor: primaryColor }}>
                    {button}
                  </span>
                )}
                {button2 && (
                  <span className="px-2 py-0.5 text-[4px] font-extrabold uppercase tracking-wider rounded-full border border-white/40 text-white bg-transparent">
                    {button2}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {variant === "variant_13" && (
          <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center p-4 text-white">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-950/90 to-transparent z-0" />
            <div className="relative z-10 max-w-[80%] space-y-1">
              {title && (
                <span className="text-[6px] font-extrabold uppercase tracking-wider block" style={{ color: primaryColor }}>
                  {title}
                </span>
              )}
              <h3 className="text-[9px] font-black uppercase tracking-tight leading-tight line-clamp-2 text-white">
                {heading}
              </h3>
              <p className="text-[6px] text-slate-200 line-clamp-2 leading-normal">
                {description}
              </p>
              <div className="flex gap-1 pt-1">
                {button && (
                  <span className="px-2 py-0.5 text-[4px] font-extrabold uppercase tracking-wider rounded-full text-white inline-block animate-fade-in" style={{ backgroundColor: primaryColor }}>
                    {button}
                  </span>
                )}
                {button2 && (
                  <span className="px-2 py-0.5 text-[4px] font-extrabold uppercase tracking-wider rounded-full border border-white/40 text-white bg-transparent">
                    {button2}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {variant === "variant_14" && (
          <div className="absolute inset-0 z-10 flex flex-col justify-center items-end text-right p-4 text-white">
            <div className="absolute inset-0 bg-gradient-to-l from-slate-950/90 via-slate-950/65 to-transparent z-0" />
            <div className="relative z-10 max-w-[80%] space-y-1">
              {title && (
                <span className="text-[6px] font-extrabold uppercase tracking-wider block" style={{ color: primaryColor }}>
                  {title}
                </span>
              )}
              <h3 className="text-[9px] font-black uppercase tracking-tight leading-tight line-clamp-2 text-white">
                {heading}
              </h3>
              <p className="text-[6px] text-slate-200 line-clamp-2 leading-normal">
                {description}
              </p>
              <div className="flex gap-1 pt-1">
                {button && (
                  <span className="px-2 py-0.5 text-[4px] font-extrabold uppercase tracking-wider rounded-full text-white inline-block animate-fade-in" style={{ backgroundColor: primaryColor }}>
                    {button}
                  </span>
                )}
                {button2 && (
                  <span className="px-2 py-0.5 text-[4px] font-extrabold uppercase tracking-wider rounded-full border border-white/40 text-white bg-transparent">
                    {button2}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {variant === "variant_15" && (
          <div className="absolute inset-0 z-10 flex flex-col justify-center text-left p-4 text-white">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-transparent z-0" />
            <div className="relative z-10 max-w-[80%] space-y-1">
              <h3 className="text-[9px] font-black uppercase tracking-tight leading-tight line-clamp-2 text-white">
                {heading}
              </h3>
              <p className="text-[6px] text-slate-200 line-clamp-2 leading-normal">
                {description}
              </p>
            </div>
          </div>
        )}

        {variant === "variant_16" && (
          <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center p-4 text-white">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/80 to-slate-950/95 z-0" />
            <div className="relative z-10 max-w-[80%] space-y-1">
              <h3 className="text-[9px] font-black uppercase tracking-tight leading-tight line-clamp-2 text-white">
                {heading}
              </h3>
              <p className="text-[6px] text-slate-200 line-clamp-2 leading-normal">
                {description}
              </p>
            </div>
          </div>
        )}

        {variant === "variant_17" && (
          <div className="absolute inset-0 z-10 flex flex-col justify-center items-end text-right p-4 text-white">
            <div className="absolute inset-0 bg-gradient-to-l from-slate-950/90 via-slate-950/65 to-transparent z-0" />
            <div className="relative z-10 max-w-[80%] space-y-1">
              <h3 className="text-[9px] font-black uppercase tracking-tight leading-tight line-clamp-2 text-white">
                {heading}
              </h3>
              <p className="text-[6px] text-slate-200 line-clamp-2 leading-normal">
                {description}
              </p>
            </div>
          </div>
        )}

        {variant === "variant_18" && (
          <div className="absolute inset-0 z-10 flex flex-col justify-center text-left p-4 text-white">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-transparent z-0" />
            <div className="relative z-10 max-w-[80%] space-y-1">
              <h3 className="text-[9px] font-black uppercase tracking-tight leading-tight line-clamp-2 text-white">
                {heading}
              </h3>
              <p className="text-[6px] text-slate-200 line-clamp-2 leading-normal">
                {description}
              </p>
              {button && (
                <div className="pt-1">
                  <span className="px-2 py-0.5 text-[4px] font-extrabold uppercase tracking-wider rounded-full text-white inline-block animate-fade-in" style={{ backgroundColor: primaryColor }}>
                    {button}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {variant === "variant_19" && (
          <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center p-4 text-white">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/80 to-slate-950/95 z-0" />
            <div className="relative z-10 max-w-[80%] space-y-1">
              <h3 className="text-[9px] font-black uppercase tracking-tight leading-tight line-clamp-2 text-white">
                {heading}
              </h3>
              <p className="text-[6px] text-slate-200 line-clamp-2 leading-normal">
                {description}
              </p>
              {button && (
                <div className="pt-1">
                  <span className="px-2 py-0.5 text-[4px] font-extrabold uppercase tracking-wider rounded-full text-white inline-block animate-fade-in" style={{ backgroundColor: primaryColor }}>
                    {button}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {variant === "variant_20" && (
          <div className="absolute inset-0 z-10 flex flex-col justify-center items-end text-right p-4 text-white">
            <div className="absolute inset-0 bg-gradient-to-l from-slate-950/90 via-slate-950/65 to-transparent z-0" />
            <div className="relative z-10 max-w-[80%] space-y-1">
              <h3 className="text-[9px] font-black uppercase tracking-tight leading-tight line-clamp-2 text-white">
                {heading}
              </h3>
              <p className="text-[6px] text-slate-200 line-clamp-2 leading-normal">
                {description}
              </p>
              {button && (
                <div className="pt-1">
                  <span className="px-2 py-0.5 text-[4px] font-extrabold uppercase tracking-wider rounded-full text-white inline-block animate-fade-in" style={{ backgroundColor: primaryColor }}>
                    {button}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {variant === "variant_21" && (
          <div className="absolute inset-0 z-10 flex flex-col justify-center text-left p-4 text-white">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-transparent z-0" />
            <div className="relative z-10 max-w-[80%] space-y-1">
              <h3 className="text-[9px] font-black uppercase tracking-tight leading-tight line-clamp-2 text-white">
                {heading}
              </h3>
              <p className="text-[6px] text-slate-200 line-clamp-2 leading-normal">
                {description}
              </p>
              <div className="flex gap-1 pt-1">
                {button && (
                  <span className="px-2 py-0.5 text-[4px] font-extrabold uppercase tracking-wider rounded-full text-white inline-block animate-fade-in" style={{ backgroundColor: primaryColor }}>
                    {button}
                  </span>
                )}
                {button2 && (
                  <span className="px-2 py-0.5 text-[4px] font-extrabold uppercase tracking-wider rounded-full border border-white/40 text-white bg-transparent">
                    {button2}
                  </span>
                )}
                     </div>
            </div>
          </div>
        )}
          {variant === "variant_22" && (
          <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center p-4 text-white">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-950/90 to-transparent z-0" />
            <div className="relative z-10 max-w-[80%] space-y-1">
              {title && (
                <span className="text-[6px] font-extrabold uppercase tracking-wider block" style={{ color: primaryColor }}>
                  {title}
                </span>
              )}
              <h3 className="text-[9px] font-black uppercase tracking-tight leading-tight line-clamp-2 text-white">
                {heading}
              </h3>
              <p className="text-[6px] text-slate-200 line-clamp-2 leading-normal">
                {description}
              </p>
              <div className="flex gap-1 pt-1">
                {button && (
                  <span className="px-2 py-0.5 text-[4px] font-extrabold uppercase tracking-wider rounded-full text-white inline-block animate-fade-in" style={{ backgroundColor: primaryColor }}>
                    {button}
                  </span>
                )}
                {button2 && (
                  <span className="px-2 py-0.5 text-[4px] font-extrabold uppercase tracking-wider rounded-full border border-white/40 text-white bg-transparent">
                    {button2}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {variant === "variant_23" && (
          <div className="absolute inset-0 z-10 flex flex-col justify-center items-end text-right p-4 text-white">
            <div className="absolute inset-0 bg-gradient-to-l from-slate-950/90 via-slate-950/65 to-transparent z-0" />
            <div className="relative z-10 max-w-[80%] space-y-1">
              <h3 className="text-[9px] font-black uppercase tracking-tight leading-tight line-clamp-2 text-white">
                {heading}
              </h3>
              <p className="text-[6px] text-slate-200 line-clamp-2 leading-normal">
                {description}
              </p>
              <div className="flex gap-1 pt-1">
                {button && (
                  <span className="px-2 py-0.5 text-[4px] font-extrabold uppercase tracking-wider rounded-full text-white inline-block animate-fade-in" style={{ backgroundColor: primaryColor }}>
                    {button}
                  </span>
                )}
                {button2 && (
                  <span className="px-2 py-0.5 text-[4px] font-extrabold uppercase tracking-wider rounded-full border border-white/40 text-white bg-transparent">
                    {button2}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
         
      </div>
    );
  };

  if (isLoading || heroLoading) return <WebsiteSettingsPageSkeleton />;

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-6 py-8 custom-scrollbar">
      {/* Page Header */}
      <div className="max-w-[1700px] mx-auto mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b] dark:text-white mb-1 flex items-center gap-2.5">
            <Sparkles className="text-primary size-6 " />
            Hero Section Customization
          </h1>
          <p className="text-sm text-[var(--vendor-text-muted)]">
            Design your website home banner. Select beautiful layout variants, customize text values, and upload high-resolution images.
          </p>
        </div>
        <Button variant="ghost" onClick={() => router.push("/website/home")} className="text-[var(--vendor-control-text)] font-semibold text-slate-500 hover:text-[var(--vendor-primary-btn)] gap-2">
          <RotateCcw size={14} className="rotate-90" /> BACK TO LIST
        </Button>
      </div>

      <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Body */}
        <div className="lg:col-span-9 space-y-8">
          
          {/* Form Card */}
          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[var(--vendor-radius-panel)] overflow-hidden">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-[var(--vendor-radius-control)]">
                  <Edit className="w-5 h-5 text-[var(--vendor-primary-btn)] dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">Hero Banner Data Fields</CardTitle>
                  <CardDescription className="text-xs">Configure the text headings, labels, button destination, and banner visual.</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {/* Left column */}
              <div className="space-y-6">
                {!["variant_15", "variant_16", "variant_17", "variant_18", "variant_19", "variant_20", "variant_21","variant_22","variant_23"].includes(variant) && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        Title
                      </Label>
                      <span className="text-xs text-slate-500 font-mono">
                        {title?.length || 0}/50
                      </span>
                    </div>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={50}
                      disabled={!isEditing}
                      placeholder="Enter top badge label"
                      className="h-11 rounded-sm border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 font-medium disabled:cursor-default disabled:pointer-events-auto"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      Heading
                    </Label>
                    <span className="text-xs text-slate-500 font-mono">
                      {heading?.length || 0}/100
                    </span>
                  </div>
                  <Input
                    value={heading}
                    onChange={(e) => setHeading(e.target.value)}
                    maxLength={100}
                    disabled={!isEditing}
                    placeholder="Enter main layout banner heading"
                    className="h-11 rounded-sm border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 font-medium text-slate-900 dark:text-slate-100 disabled:cursor-default disabled:pointer-events-auto"
                  />
                </div>

                {!["variant_6", "variant_7", "variant_8", "variant_15", "variant_16", "variant_17"].includes(variant) && (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                          Button 1 Label
                        </Label>
                        <span className="text-xs text-slate-500 font-mono">
                          {button?.length || 0}/20
                        </span>
                      </div>
                      <Input
                        value={button}
                        onChange={(e) => setButton(e.target.value)}
                        maxLength={20}
                        disabled={!isEditing}
                        placeholder="Enter first button text label"
                        className="h-11 rounded-sm border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 font-medium disabled:cursor-default disabled:pointer-events-auto"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        button 1 url link
                      </Label>
                      <Select
                        value={pageId ? String(pageId) : "none"}
                        onValueChange={(v) => setPageId(v === "none" ? null : Number(v))}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="w-full h-11 rounded-sm border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 font-medium text-[var(--vendor-text)] disabled:cursor-default">
                          <SelectValue placeholder="select url link page" />
                        </SelectTrigger>
                        <SelectContent className="rounded-sm border-slate-100 dark:bg-sidebar dark:border-white/10 text-[var(--vendor-text)]">
                          <SelectItem value="none" className="text-[var(--vendor-control-text)] font-semibold text-slate-400">select url link page</SelectItem>
                          {pages.map((page: any) => (
                            <SelectItem key={page.id} value={String(page.id)} className="text-[var(--vendor-text)] font-semibold">
                              {page.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {["variant_1", "variant_12", "variant_13", "variant_14", "variant_21","variant_22","variant_23"].includes(variant) && (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                          Button 2 Label
                        </Label>
                        <span className="text-xs text-slate-500 font-mono">
                          {button2?.length || 0}/20
                        </span>
                      </div>
                      <Input
                        value={button2}
                        onChange={(e) => setButton2(e.target.value)}
                        maxLength={20}
                        disabled={!isEditing}
                        placeholder="Enter second button text label"
                        className="h-11 rounded-sm border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 font-medium disabled:cursor-default disabled:pointer-events-auto"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        button 2 url link
                      </Label>
                      <Select
                        value={pageId2 ? String(pageId2) : "none"}
                        onValueChange={(v) => setPageId2(v === "none" ? null : Number(v))}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="w-full h-11 rounded-sm border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 font-medium text-[var(--vendor-text)] disabled:cursor-default">
                          <SelectValue placeholder="select url link page" />
                        </SelectTrigger>
                        <SelectContent className="rounded-sm border-slate-100 dark:bg-sidebar dark:border-white/10 text-[var(--vendor-text)]">
                          <SelectItem value="none" className="text-[var(--vendor-control-text)] font-semibold text-slate-400">select url link page</SelectItem>
                          {pages.map((page: any) => (
                            <SelectItem key={page.id} value={String(page.id)} className="text-[var(--vendor-text)] font-semibold">
                              {page.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      Description Text Content
                    </Label>
                    <span className="text-xs text-slate-500 font-mono">
                      {description?.length || 0}/200
                    </span>
                  </div>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={200}
                    disabled={!isEditing}
                    rows={5}
                    placeholder="Describe your brand features..."
                    className="rounded-sm border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 resize-none leading-relaxed font-medium disabled:cursor-default"
                  />
                </div>
              </div>

              {/* Graphic / Image Upload side */}
              <div className="space-y-6">
                {variant === "variant_3" || variant === "variant_5" ? (
                  <>
                    {/* Background Image Upload */}
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        1. Background Image (BG)
                      </Label>
                      
                      <div
                        onClick={() => {
                          if (isEditing && !isSubmitting && !bgImageUrl) {
                            setActiveUploadField("bg");
                            setTimeout(() => fileInputRef.current?.click(), 50);
                          }
                        }}
                        className={cn(
                          "w-full max-w-[600px] h-[300px] rounded-[var(--vendor-radius-panel)] transition-all relative overflow-hidden group flex flex-col items-center justify-center p-2",
                          bgImageUrl
                            ? "border-none bg-white dark:bg-slate-900"
                            : isEditing
                            ? "border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-900 cursor-pointer"
                            : "border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 cursor-default opacity-80"
                        )}
                        style={{ cursor: isEditing && !bgImageUrl ? "pointer" : "default" }}
                      >
                        {isSubmitting && activeUploadField === "bg" ? (
                          <div className="text-center space-y-3">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                            <p className="text-[var(--vendor-control-text)] font-semibold text-slate-500 uppercase tracking-wider">Uploading BG…</p>
                          </div>
                        ) : bgImageUrl ? (
                          <>
                            <Image 
                              src={bgImageUrl} 
                              alt="Background Preview" 
                              fill 
                              className="object-cover rounded-sm"
                              unoptimized
                            />
                            {isEditing && (
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-sm z-10">
                                <Button 
                                  variant="destructive" 
                                  size="icon" 
                                  onClick={(e) => { 
                                    e.stopPropagation(); 
                                    setBgImageUrl(""); 
                                  }} 
                                  className="w-10 h-10 rounded-sm shadow-xl"
                                >
                                  <X size={20} />
                                </Button>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-center space-y-2">
                            <div className="p-3 bg-white dark:bg-slate-800 rounded-[var(--vendor-radius-panel)] shadow-sm inline-block text-primary">
                              <Upload size={20} />
                            </div>
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">Upload Image</p>
                              <p className="text-[9px] text-slate-400 mt-0.5">
                                Below 5 MB JPG or PNG
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Side PNG Image Upload / Variant 6 Main Image */}
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        2. Right Side PNG Image
                      </Label>
                      
                      <div
                        onClick={() => {
                          if (isEditing && !isSubmitting && !imageUrl) {
                            setActiveUploadField("main");
                            setTimeout(() => fileInputRef.current?.click(), 50);
                          }
                        }}
                        className={cn(
                          "w-full max-w-[600px] h-[300px] rounded-[var(--vendor-radius-panel)] transition-all relative overflow-hidden group flex flex-col items-center justify-center p-2",
                          imageUrl
                            ? "border-none bg-white dark:bg-slate-900"
                            : isEditing
                            ? "border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-900 cursor-pointer"
                            : "border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 cursor-default opacity-80"
                        )}
                        style={{ cursor: isEditing && !imageUrl ? "pointer" : "default" }}
                      >
                        {isSubmitting && activeUploadField === "main" ? (
                          <div className="text-center space-y-3">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                            <p className="text-[var(--vendor-control-text)] font-semibold text-slate-500 uppercase tracking-wider">Uploading...</p>
                          </div>
                        ) : imageUrl ? (
                          <>
                            <div className="absolute inset-0 bg-[#FFF8EE]/80 dark:bg-amber-950/10 rounded-sm pointer-events-none" />
                            <Image 
                              src={imageUrl} 
                              alt="Right PNG Preview" 
                              fill 
                              className="object-contain rounded-sm"
                              unoptimized
                            />
                            {isEditing && (
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-sm z-10">
                                <Button 
                                  variant="destructive" 
                                  size="icon" 
                                  onClick={(e) => { 
                                    e.stopPropagation(); 
                                    setImageUrl(""); 
                                  }} 
                                  className="w-10 h-10 rounded-sm shadow-xl"
                                >
                                  <X size={20} />
                                </Button>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-center space-y-2">
                            <div className="p-3 bg-white dark:bg-slate-800 rounded-[var(--vendor-radius-panel)] shadow-sm inline-block text-primary">
                              <Upload size={20} />
                            </div>
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">Upload Image</p>
                              <p className="text-[9px] text-slate-400 mt-0.5">
                                Below 5 MB JPG or PNG
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {["variant_2", "variant_4", "variant_6", "variant_7", "variant_8", "variant_9", "variant_10", "variant_11", "variant_12", "variant_13", "variant_14", "variant_15", "variant_16", "variant_17", "variant_18", "variant_19", "variant_20"].includes(variant) ? "Hero Background Image" : "Banner Graphic / Illustration Image"}
                    </Label>

                    {/* Upload & Crop Area */}
                    <div
                      onClick={() => {
                        if (isEditing && !isSubmitting && !imageUrl) {
                          setActiveUploadField("main");
                          setTimeout(() => fileInputRef.current?.click(), 50);
                        }
                      }}
                      className={cn(
                        "w-full max-w-[600px] h-[300px] rounded-[var(--vendor-radius-panel)] transition-all relative overflow-hidden group flex flex-col items-center justify-center p-2",
                        imageUrl
                          ? "border-none bg-white dark:bg-slate-900"
                          : isEditing
                          ? "border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-900 cursor-pointer"
                          : "border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 cursor-default opacity-80"
                      )}
                      style={{ cursor: isEditing && !imageUrl ? "pointer" : "default" }}
                    >
                      {isSubmitting ? (
                        <div className="text-center space-y-3">
                          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                          <p className="text-[var(--vendor-control-text)] font-semibold text-slate-500 uppercase tracking-wider">Uploading…</p>
                        </div>
                      ) : imageUrl ? (
                        <>
                          <Image 
                            src={imageUrl} 
                            alt="Hero Preview" 
                            fill 
                            className="object-cover rounded-sm"
                            unoptimized
                          />

                          {["variant_2", "variant_6", "variant_7", "variant_8", "variant_9", "variant_10", "variant_11", "variant_12", "variant_13", "variant_14", "variant_15", "variant_16", "variant_17", "variant_18", "variant_19", "variant_20"].includes(variant) && (
                            <div className="absolute inset-0 bg-slate-950/45 rounded-sm pointer-events-none" />
                          )}

                          {isEditing && (
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-sm z-10">
                              <Button 
                                variant="destructive" 
                                size="icon" 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  setImageUrl(""); 
                                }} 
                                className="w-10 h-10 rounded-sm shadow-xl animate-in zoom-in duration-200"
                              >
                                <X size={20} />
                              </Button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center space-y-4">
                          <div className="p-4 bg-white dark:bg-slate-800 rounded-[var(--vendor-radius-panel)] shadow-sm inline-block text-primary group-hover:scale-110 transition-transform duration-500">
                            <Upload size={28} />
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">Upload Image</p>
                            <p className="text-[10px] font-medium text-slate-400 mt-1">
                              Below 5 MB JPG or PNG
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={(e) => handleImageUpload(e, activeUploadField)} 
                  className="hidden" 
                  accept="image/jpeg,image/png" 
                />
              </div>

              {/* FULL WIDTH STAT CARDS SECTION */}
              {variant === "variant_4" && (
                <div className="md:col-span-2 pt-8 border-t border-slate-100 dark:border-slate-800 space-y-4 w-full">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="size-4 text-amber-500" />
                    Hero Section Stats Cards
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Stat 1 */}
                    <div className="space-y-3 p-4 bg-slate-50/50 dark:bg-slate-950/30 rounded-lg border border-slate-100 dark:border-slate-800/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Card 1</span>
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Stat Value</Label>
                        <Input
                          value={stat1Val}
                          onChange={(e) => setStat1Val(e.target.value)}
                          disabled={!isEditing}
                          placeholder="Enter value"
                          className="h-10 text-xs rounded-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 disabled:cursor-default disabled:pointer-events-auto"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Stat Label</Label>
                        <Input
                          value={stat1Lbl}
                          onChange={(e) => setStat1Lbl(e.target.value)}
                          disabled={!isEditing}
                          placeholder="Enter label"
                          className="h-10 text-xs rounded-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 disabled:cursor-default disabled:pointer-events-auto"
                        />
                      </div>
                    </div>

                    {/* Stat 2 */}
                    <div className="space-y-3 p-4 bg-slate-50/50 dark:bg-slate-950/30 rounded-lg border border-slate-100 dark:border-slate-800/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Card 2</span>
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Stat Value</Label>
                        <Input
                          value={stat2Val}
                          onChange={(e) => setStat2Val(e.target.value)}
                          disabled={!isEditing}
                          placeholder="Enter value"
                          className="h-10 text-xs rounded-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 disabled:cursor-default disabled:pointer-events-auto"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Stat Label</Label>
                        <Input
                          value={stat2Lbl}
                          onChange={(e) => setStat2Lbl(e.target.value)}
                          disabled={!isEditing}
                          placeholder="Enter label"
                          className="h-10 text-xs rounded-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 disabled:cursor-default disabled:pointer-events-auto"
                        />
                      </div>
                    </div>

                    {/* Stat 3 */}
                    <div className="space-y-3 p-4 bg-slate-50/50 dark:bg-slate-950/30 rounded-lg border border-slate-100 dark:border-slate-800/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Card 3</span>
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Stat Value</Label>
                        <Input
                          value={stat3Val}
                          onChange={(e) => setStat3Val(e.target.value)}
                          disabled={!isEditing}
                          placeholder="Enter value"
                          className="h-10 text-xs rounded-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 disabled:cursor-default disabled:pointer-events-auto"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Stat Label</Label>
                        <Input
                          value={stat3Lbl}
                          onChange={(e) => setStat3Lbl(e.target.value)}
                          disabled={!isEditing}
                          placeholder="Enter label"
                          className="h-10 text-xs rounded-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 disabled:cursor-default disabled:pointer-events-auto"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>


        </div>

        {/* Side sticky options panel */}
        <div className="lg:col-span-3 space-y-4 lg:sticky lg:top-8">
          <div className="bg-[var(--vendor-panel-bg)] backdrop-blur-md p-6 rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-3">
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className={`w-full h-12 font-bold text-[13px] tracking-[0.1em] uppercase rounded-[var(--vendor-radius-panel)] shadow-sm transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 ${
                isEditing
                  ? "bg-amber-500 text-white border-none hover:bg-amber-600 shadow-amber-500/20"
                  : "bg-white dark:bg-[#1e293b] text-[var(--vendor-text)] border border-[var(--vendor-border)] dark:border-[var(--vendor-border)] hover:bg-gray-50 dark:hover:bg-gray-800/50"
              }`}
            >
             <Edit className="size-4" />
              EDIT
            </Button>

            <PersistenceActions
              onSave={handleSave}
              onPreview={() => window.open("/preview#hero-section", "_blank")}
              onReset={handleReset}
              onCancel={() => router.push("/website/home")}
              saveLabel={isSubmitting ? "SAVING..." : "UPDATE LAYOUT"}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Adapted Visual Desktop Live Preview Card */}
          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[var(--vendor-radius-panel)] overflow-hidden">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-[var(--vendor-radius-control)]">
                  <ImageIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">Layout Live Preview</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {renderLivePreviewContent()}
            </CardContent>
          </Card>
        </div>
      </div>

      <ImageCropper
        open={cropperOpen}
        imageSrc={imageToCrop}
        onClose={() => setCropperOpen(false)}
        onCropComplete={handleCropComplete}
        aspectRatio={cropperAspect}
        outputWidth={cropperWidth}
        outputHeight={cropperHeight}
      />
    </div>
  );
}
