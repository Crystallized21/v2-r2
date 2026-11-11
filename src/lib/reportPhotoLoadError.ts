import * as Sentry from "@sentry/nextjs";
import { GalleryPhoto } from "@/types/photo";

type PhotoKind = "thumbnail" | "preview";

// one report per photo per page load, an expired page would otherwise send hundreds
const alreadyReported = new Set<string>();

// "20261111T050000Z" -> Date
function parseAmzDate(value: string) {
  const iso = value.replace(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/, "$1-$2-$3T$4:$5:$6Z");

  return new Date(iso);
}

// whether the signed URL had already expired tells us if it's the refresh that missed it
function getSignatureInfo(url: URL) {
  const signedAt = parseAmzDate(url.searchParams.get("X-Amz-Date") ?? "");
  const expiresInSeconds = Number(url.searchParams.get("X-Amz-Expires"));
  const expiresAt = signedAt.getTime() + expiresInSeconds * 1000;

  return {
    signedAt: signedAt.toISOString(),
    minutesSinceSigned: Math.round((Date.now() - signedAt.getTime()) / 60000),
    expired: Date.now() > expiresAt,
  };
}

export function reportPhotoLoadError(albumSlug: string, photo: GalleryPhoto, kind: PhotoKind) {
  const reportKey = `${photo.id}-${kind}`;

  if (alreadyReported.has(reportKey)) {
    return;
  }

  alreadyReported.add(reportKey);

  const url = new URL(kind === "thumbnail" ? photo.thumbnailUrl : photo.previewUrl);

  Sentry.captureMessage(`Album ${kind} failed to load`, {
    level: "warning",
    tags: { album: albumSlug, kind },
    contexts: {
      photo: {
        id: photo.id,
        filename: photo.filename,
        // no query string, the signature works like a temporary password for the file
        r2Path: url.pathname,
        ...getSignatureInfo(url),
        online: navigator.onLine,
        pageVisible: document.visibilityState,
      },
    },
  });
}
