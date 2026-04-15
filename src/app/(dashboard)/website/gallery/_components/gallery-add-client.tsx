"use client";

import { useRouter } from "next/navigation";
import GalleryAdd from "./gallery-add";
import { useAddGallery } from "../../../../../hooks/use-gallery";  

interface GalleryFormData {
  eventName: string;
  city: string;
  image: string;
}

export default function GalleryAddClient() {
  const router = useRouter();
  const { mutate: addGallery, isPending } = useAddGallery();

  const handleSave = (data: GalleryFormData) => {
    addGallery(
      {
        event_name: data.eventName,  // ← map camelCase → snake_case
        city: data.city,
        event_img: data.image,       // ← map image → event_img
      },
      {
        onSuccess: () => router.push("/website/gallery"),
      }
    );
  };

  return <GalleryAdd onSave={handleSave} loading={isPending} />;
}