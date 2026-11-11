"use client";

import { useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import Download from "yet-another-react-lightbox/plugins/download";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { GalleryPhoto } from "@/types/photo";

type AlbumLightboxProps = {
  photos: GalleryPhoto[];
  albumName: string;
  albumSlug: string;
  index: number;
  onClose: () => void;
  onPreviewError: (photo: GalleryPhoto) => void;
};

// The upload script makes previews at most 2048px on the long edge.
// Zoom uses this size, so it stops before the preview gets blurry.
function getPreviewSize(width: number, height: number) {
  const scale = Math.min(1, 2048 / Math.max(width, height));

  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}

export default function AlbumLightbox({ photos, albumName, albumSlug, index, onClose, onPreviewError }: AlbumLightboxProps) {
  // YARL doesn't let us pass onError to its images. Load errors don't bubble,
  // but they can be caught on window in the capture phase.
  useEffect(() => {
    function handleImageError(event: Event) {
      const image = event.target;

      if (!(image instanceof HTMLImageElement) || !image.classList.contains("yarl__slide_image")) {
        return;
      }

      const photo = photos.find((candidate) => candidate.previewUrl === image.src);

      if (photo) {
        onPreviewError(photo);
      }
    }

    window.addEventListener("error", handleImageError, true);

    return () => window.removeEventListener("error", handleImageError, true);
  }, [photos, onPreviewError]);

  const slides = photos.map((photo, photoIndex) => ({
    src: photo.previewUrl,
    alt: `${albumName}, photo ${photoIndex + 1}`,
    ...getPreviewSize(photo.width, photo.height),
    // goes through our route so the session is checked before the original is signed
    download: {
      url: `/api/albums/${albumSlug}/downloads/${photo.id}`,
      filename: photo.filename,
    },
  }));

  return (
    <Lightbox
      plugins={[Zoom, Download]}
      zoom={{ doubleClickDelay: 200, doubleClickMaxStops: 1 }}
      open={index >= 0}
      close={onClose}
      index={index}
      slides={slides}
    />
  );
}
