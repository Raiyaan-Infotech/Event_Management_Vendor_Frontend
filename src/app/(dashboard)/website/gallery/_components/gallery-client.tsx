"use client";

import { useRouter } from "next/navigation";
import GalleryList from "./gallery-list";
import { useGallery, useDeleteGallery, useToggleGalleryStatus } from "@/hooks/use-gallery";

export default function GalleryClient() {
  const router = useRouter();
  const { data: items = [], isLoading } = useGallery();
  const { mutate: deleteItem }   = useDeleteGallery();
  const { mutate: toggleStatus } = useToggleGalleryStatus();

  return (
    <GalleryList
      galleryItems={items.map((item) => ({
        id:        String(item.id),
        eventName: item.event_name,
        city:      item.city,
        images:    item.images ?? [],
        imgView:   item.img_view,
        isActive:  item.is_active,
        createdAt: new Date(item.createdAt).toLocaleDateString("en-IN"),
      }))}
      onDelete={(id) => deleteItem(Number(id))}
      onEdit={(item) => router.push(`/website/gallery/edit/${item.id}`)}
      onToggleStatus={(id) => toggleStatus(Number(id))}
      loading={isLoading}
    />
  );
}
