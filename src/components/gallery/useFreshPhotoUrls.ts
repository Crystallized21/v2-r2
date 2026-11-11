"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { GalleryPhoto } from "@/types/photo";

// URLs are good for at least an hour after the server signs them
const REFRESH_AFTER_MS = 30 * 60 * 1000;

// stops a photo that's actually broken from refreshing the page over and over
const MIN_GAP_MS = 60 * 1000;

// router.refresh() re-renders the page on the server with new URLs. Images already
// on screen stay put, and if the session ran out it shows the password form instead.
export function useFreshPhotoUrls(photos: GalleryPhoto[]) {
  const router = useRouter();
  const signedAt = useRef(0);
  const lastRefreshAt = useRef(0);

  // a new photos prop means the server just signed new URLs
  useEffect(() => {
    signedAt.current = Date.now();
  }, [photos]);

  const refresh = useCallback(() => {
    if (Date.now() - lastRefreshAt.current < MIN_GAP_MS) {
      return;
    }

    lastRefreshAt.current = Date.now();
    router.refresh();
  }, [router]);

  // phones restore old tabs without reloading, so check when the page is looked at again
  useEffect(() => {
    function handleReturn() {
      if (document.visibilityState !== "visible") return;

      if (Date.now() - signedAt.current > REFRESH_AFTER_MS) {
        refresh();
      }
    }

    document.addEventListener("visibilitychange", handleReturn);
    // back/forward cache restores don't fire visibilitychange
    window.addEventListener("pageshow", handleReturn);

    return () => {
      document.removeEventListener("visibilitychange", handleReturn);
      window.removeEventListener("pageshow", handleReturn);
    };
  }, [refresh]);

  // for an image that fails to load, e.g. a laptop left open on the page
  return refresh;
}
