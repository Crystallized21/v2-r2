import "server-only";
import { db } from "@/lib/clients/db";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Matches on album id too, so a session for one album can't download photos from another
export async function getPhotoForDownload(albumId: string, photoId: string) {
  // Postgres errors on anything that isn't a uuid, treat it as not found instead
  if (!UUID.test(photoId)) {
    return null;
  }

  const { data, error } = await db
    .from("photos")
    .select("r2_key_original, original_filename")
    .eq("id", photoId)
    .eq("album_id", albumId)
    .maybeSingle();

  if (error) throw error;

  return data;
}
