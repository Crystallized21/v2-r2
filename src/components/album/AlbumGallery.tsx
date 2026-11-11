"use client";

import Masonry from "react-masonry-css";
import ImageContainer from "@/components/album/ImageContainer";
import { GalleryPhoto } from "@/types/photo";

type AlbumGalleryProps = {
  photos: GalleryPhoto[];
  albumName: string;
  onImageClick: (index: number) => void;
};

export default function AlbumGallery({ photos, albumName, onImageClick }: AlbumGalleryProps) {
  return (
    <Masonry
      breakpointCols={{ default: 4, 1280: 3, 768: 2, 640: 1 }}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {photos.map((photo, index) => (
        <ImageContainer
          key={photo.id}
          src={photo.thumbnailUrl}
          alt={`${albumName}, photo ${index + 1}`}
          width={photo.width}
          height={photo.height}
          onClick={() => onImageClick(index)}
        />
      ))}
    </Masonry>
  );
}
