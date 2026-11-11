import { db } from "@/lib/clients/db";
import { Album } from "@/types/album";

export async function getAlbums(): Promise<Album[]> {
  const { data, error } = await db
    .from("albums")
    .select("id, slug, name, event_date")
    .eq("published", true);

  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    eventDate: row.event_date,
  }));
}
