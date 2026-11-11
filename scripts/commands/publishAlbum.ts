import { db } from "../lib/clients";
import { findAlbum } from "../lib/findAlbum";

export async function publishAlbum(slug: string) {
  const album = await findAlbum(slug);

  if (album.published) {
    console.log(`"${album.name}" is already published.`);
    return;
  }

  const { error } = await db.from("albums").update({ published: true }).eq("id", album.id);

  if (error) throw error;

  console.log(`Published. /albums/${album.slug}`);
}
