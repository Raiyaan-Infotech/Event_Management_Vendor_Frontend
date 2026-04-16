"use client";

import { useRouter } from "next/navigation";
import GalleryAdd, { GalleryFormData } from "./gallery-add";
import { useAddGallery } from "@/hooks/use-gallery";

export default function GalleryAddClient() {
  const router = useRouter();
  const { mutate: addGallery, isPending } = useAddGallery();

  const handleSave = (data: GalleryFormData) => {
    addGallery(
      {
        event_name: data.eventName,
        city:       data.city,
        images:     data.images.map((img) => img.previewUrl),
        img_view:   data.imgView,
        is_active:  data.isActive ? 1 : 0,
      },
      { onSuccess: () => router.push("/website/gallery") }
    );
  };

  return <GalleryAdd onSave={handleSave} loading={isPending} />;
}
