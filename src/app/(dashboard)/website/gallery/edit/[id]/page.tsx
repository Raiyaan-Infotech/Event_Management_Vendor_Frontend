import GalleryEditClient from "../../_components/gallery-edit-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function GalleryEditPage({ params }: PageProps) {
  const { id } = await params;
  return <GalleryEditClient id={id} />;
}