"use client";

import { useRouter } from "next/navigation";
import GalleryEdit from "./gallery-edit";
import { useGalleryItem, useUpdateGallery } from "@/hooks/use-gallery";

interface GalleryEditClientProps {
  id: string;
}

interface GalleryFormData {
  eventName: string;
  city: string;
  image: string;
}

export default function GalleryEditClient({ id }: GalleryEditClientProps) {
  const router = useRouter();
  const { data: item, isLoading } = useGalleryItem(id);
  const { mutate: updateItem, isPending } = useUpdateGallery();

  const handleSave = (data: GalleryFormData) => {
    updateItem(
      {
        id: Number(id),
        event_name: data.eventName,
        city: data.city,
        event_img: data.image,
      },
      {
        onSuccess: () => {
          router.push("/website/gallery");
        },
      }
    );
  };

  return (
    <GalleryEdit
      onSave={handleSave}
      loading={isPending}
      initialData={
        item
          ? {
              eventName: item.event_name,
              city: item.city,
              image: item.event_img,
            }
          : undefined
      }
      isLoading={isLoading}
    />
  );
}