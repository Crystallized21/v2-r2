"use client";

import Masonry from "react-masonry-css";
import ImageContainer from "@/components/album/ImageContainer";
import { GalleryPhoto } from "@/types/photo";

type AlbumGalleryProps = {
  photos: GalleryPhoto[];
  albumName: string;
  onImageClick: (index: number) => void;
  onImageError: (photo: GalleryPhoto) => void;
};

// react-masonry-css only knows the screen width once it's running in the browser,
// so the server always sent 4 columns and phones jumped to 1 after loading.
// Instead every layout is rendered and CSS shows the one that fits, before first paint.
// The hidden ones cost nothing, lazy images inside display: none never download.
const LAYOUTS = [
  { columns: 1, className: "sm:hidden" },
  { columns: 2, className: "hidden sm:block md:hidden" },
  { columns: 3, className: "hidden md:block xl:hidden" },
  { columns: 4, className: "hidden xl:block" },
];

export default function AlbumGallery({ photos, albumName, onImageClick, onImageError }: AlbumGalleryProps) {
  return (
    <>
      {LAYOUTS.map((layout) => (
        <div key={layout.columns} className={layout.className}>
          <Masonry
            breakpointCols={layout.columns}
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
                onError={() => onImageError(photo)}
              />
            ))}
          </Masonry>
        </div>
      ))}
    </>
  );
}
