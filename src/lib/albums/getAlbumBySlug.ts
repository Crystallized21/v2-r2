import { db } from "@/lib/clients/db";

export async function getAlbumBySlug(slug: string) {
  const { data, error } = await db
    .from("albums")
    .select("id, name, slug, event_date, password_version")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) throw error;

  return data;
}
