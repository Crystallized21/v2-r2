import "server-only";
import { db } from "@/lib/clients/db";
import { signPhotoUrl } from "@/lib/albums/signPhotoUrl";
import { GalleryPhoto } from "@/types/photo";

// Only call this after checking the album session, the URLs give access to the photos
export async function getGalleryPhotos(albumId: string): Promise<GalleryPhoto[]> {
  const { data, error } = await db
    .from("photos")
    .select("id, width, height, r2_key_thumbnail, r2_key_preview")
    .eq("album_id", albumId)
    .order("sort_order");

  if (error) throw error;

  return Promise.all(data.map(async (photo) => ({
    id: photo.id,
    // older rows might not have a size, 3:2 is the usual camera shape
    width: photo.width ?? 3,
    height: photo.height ?? 2,
    thumbnailUrl: await signPhotoUrl(photo.r2_key_thumbnail),
    previewUrl: await signPhotoUrl(photo.r2_key_preview),
  })));
}
