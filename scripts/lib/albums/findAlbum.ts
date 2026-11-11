import { db } from "../setup/clients";

// unlike the site's getAlbumBySlug, this also finds unpublished albums
export async function findAlbum(slug: string) {
  const { data, error } = await db
    .from("albums")
    .select("id, slug, name, published, password_version")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    throw new Error(`No album with slug "${slug}"`);
  }

  return data;
}
