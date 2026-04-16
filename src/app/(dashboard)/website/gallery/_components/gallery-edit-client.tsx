"use client";

import { useRouter } from "next/navigation";
import GalleryEdit from "./gallery-edit";
import { GalleryFormData } from "./gallery-add";
import { useGalleryItem, useUpdateGallery } from "@/hooks/use-gallery";

interface GalleryEditClientProps {
  id: string;
}

export default function GalleryEditClient({ id }: GalleryEditClientProps) {
  const router = useRouter();
  const { data: item, isLoading }       = useGalleryItem(id);
  const { mutate: updateItem, isPending } = useUpdateGallery();

  const handleSave = (data: GalleryFormData) => {
    updateItem(
      {
        id:         Number(id),
        event_name: data.eventName,
        city:       data.city,
        images:     data.images.map((img) => img.previewUrl),
        img_view:   data.imgView,
        is_active:  data.isActive ? 1 : 0,
      },
      { onSuccess: () => router.push("/website/gallery") }
    );
  };

  return (
    <GalleryEdit
      onSave={handleSave}
      loading={isPending}
      isLoading={isLoading}
      initialData={
        item
          ? {
              eventName: item.event_name,
              city:      item.city,
              images:    (item.images ?? []).map((url, i) => ({
                id:         `existing-${i}`,
                previewUrl: url,
                file:       null,
                imgView:    'public' as const,
                uploading:  false,
                error:      false,
              })),
              imgView:  item.img_view,
              isActive: item.is_active === 1,
            }
          : undefined
      }
    />
  );
}
