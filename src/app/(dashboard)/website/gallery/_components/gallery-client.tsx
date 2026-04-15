"use client";

import { useRouter } from "next/navigation";
import GalleryList from "./gallery-list";
import { useGallery, useDeleteGallery } from "@/hooks/use-gallery";

export default function GalleryClient() {
  const router = useRouter();

  const { data: items = [], isLoading } = useGallery();
  const { mutate: deleteItem } = useDeleteGallery();

  const handleDelete = (id: string) => {
    deleteItem(Number(id));
  };

  const handleEdit = (item: { id: string }) => {
    router.push(`/website/gallery/edit/${item.id}`);
  };

  return (
    <GalleryList
      galleryItems={items.map((item) => ({
        id:        String(item.id),
        eventName: item.event_name,
        city:      item.city,
        image:     item.event_img,
        createdAt: new Date(item.createdAt).toLocaleDateString("en-IN"),
      }))}
      onDelete={handleDelete}
      onEdit={handleEdit}
      loading={isLoading}
    />
  );
}