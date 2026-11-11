import { db } from "@/lib/db";

export async function getAlbumCredentials(slug: string) {
  const { data, error } = await db
    .from("albums")
    .select("id, password_hash, password_version")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) throw error;

  return data;
}
