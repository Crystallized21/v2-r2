"use client";

import { useState } from "react";
import AlbumGallery from "@/components/album/AlbumGallery";
import AlbumLightbox from "@/components/album/AlbumLightbox";
import DownloadAllLink from "@/components/album/DownloadAllLink";
import { GalleryPhoto } from "@/types/photo";
import { useFreshPhotoUrls } from "@/hooks/useFreshPhotoUrls";
import { reportPhotoLoadError } from "@/lib/reportPhotoLoadError";

type AlbumViewerProps = {
  photos: GalleryPhoto[];
  albumName: string;
  albumSlug: string;
  // null when the album has no zip yet
  archiveSizeBytes: number | null;
};

export default function AlbumViewer({ photos, albumName, albumSlug, archiveSizeBytes }: AlbumViewerProps) {
  // -1 means the lightbox is closed
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const refreshPhotoUrls = useFreshPhotoUrls(photos);

  function handleThumbnailError(photo: GalleryPhoto) {
    reportPhotoLoadError(albumSlug, photo, "thumbnail");
    refreshPhotoUrls();
  }

  function handlePreviewError(photo: GalleryPhoto) {
    reportPhotoLoadError(albumSlug, photo, "preview");
    refreshPhotoUrls();
  }

  if (photos.length === 0) {
    return (
      <p className="mt-18 text-muted-foreground">
        No photos in this album yet.
      </p>
    );
  }

  return (
    <div className="mt-16 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-700">
      {archiveSizeBytes !== null && (
        <div className="mb-4 flex justify-end">
          <DownloadAllLink albumSlug={albumSlug} sizeBytes={archiveSizeBytes} />
        </div>
      )}
      <AlbumGallery
        photos={photos}
        albumName={albumName}
        onImageClick={setLightboxIndex}
        onImageError={handleThumbnailError}
      />
      <AlbumLightbox
        photos={photos}
        albumName={albumName}
        albumSlug={albumSlug}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(-1)}
        onPreviewError={handlePreviewError}
      />
    </div>
  );
}
