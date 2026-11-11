import "server-only";
import { db } from "@/lib/clients/db";

// The zip is built by `pnpm album zip`, so an album might not have one yet
export async function getAlbumArchive(albumId: string) {
  const { data, error } = await db
    .from("album_archives")
    .select("r2_key, size_bytes")
    .eq("album_id", albumId)
    .eq("status", "ready")
    .order("generated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return data;
}
