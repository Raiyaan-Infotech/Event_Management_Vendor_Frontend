"use client";

import { useRouter } from "next/navigation";
import GalleryList from "./gallery-list";
import { useGallery, useDeleteGallery, GalleryItem } from "../../../../../hooks/use-gallery";

export default function GalleryListClient() {
  const router = useRouter();
  const { data: galleryItems = [], isLoading } = useGallery();
  const { mutate: deleteGallery } = useDeleteGallery();

  return (
    <GalleryList
      galleryItems={galleryItems.map((item: GalleryItem) => ({
        id: String(item.id),
        eventName: item.event_name,
        city: item.city,
        image: item.event_img,
        createdAt: new Date(item.createdAt).toLocaleDateString("en-IN"),
      }))}
      onDelete={(id) => deleteGallery(Number(id))}
      onEdit={(item) => router.push(`/website/gallery/edit/${item.id}`)}
      loading={isLoading}
    />
  );
}