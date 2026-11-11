"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type ImageContainerProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  onClick: () => void;
  onError: () => void;
};

export default function ImageContainer({ src, alt, width, height, onClick, onError }: ImageContainerProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group mb-4 block w-full cursor-zoom-in overflow-hidden bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground",
        isLoading && "animate-pulse",
      )}
    >
      {/* real width/height so the tile has the right shape before the image arrives */}
      <Image
        unoptimized
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={onError}
        className={cn(
          "h-auto w-full transition-opacity duration-500 group-hover:opacity-85",
          isLoading ? "opacity-0" : "opacity-100",
        )}
      />
    </button>
  );
}
