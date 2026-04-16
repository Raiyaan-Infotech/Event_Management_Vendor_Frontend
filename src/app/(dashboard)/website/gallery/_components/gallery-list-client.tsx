"use client";

import { useRouter } from "next/navigation";
import GalleryList from "./gallery-list";
import { useGallery, useDeleteGallery, useToggleGalleryStatus, GalleryItem } from "@/hooks/use-gallery";

export default function GalleryListClient() {
  const router = useRouter();
  const { data: galleryItems = [], isLoading } = useGallery();
  const { mutate: deleteGallery }  = useDeleteGallery();
  const { mutate: toggleStatus }   = useToggleGalleryStatus();

  return (
    <GalleryList
      galleryItems={galleryItems.map((item: GalleryItem) => ({
        id:        String(item.id),
        eventName: item.event_name,
        city:      item.city,
        images:    item.images ?? [],
        imgView:   item.img_view,
        isActive:  item.is_active,
        createdAt: new Date(item.createdAt).toLocaleDateString("en-IN"),
      }))}
      onDelete={(id) => deleteGallery(Number(id))}
      onEdit={(item) => router.push(`/website/gallery/edit/${item.id}`)}
      onToggleStatus={(id) => toggleStatus(Number(id))}
      loading={isLoading}
    />
  );
}
