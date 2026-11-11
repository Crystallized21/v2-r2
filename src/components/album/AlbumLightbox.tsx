"use client";

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

export default function AlbumLightbox({ photos, albumName, albumSlug, index, onClose }: AlbumLightboxProps) {
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
