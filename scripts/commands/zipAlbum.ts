import { buildAlbumZip } from "../lib/buildAlbumZip";
import { findAlbum } from "../lib/findAlbum";

export async function zipAlbum(slug: string) {
  const album = await findAlbum(slug);

  await buildAlbumZip(album);
}
