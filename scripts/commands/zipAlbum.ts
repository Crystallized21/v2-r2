import { buildAlbumZip } from "../lib/upload/buildAlbumZip";
import { findAlbum } from "../lib/albums/findAlbum";

export async function zipAlbum(slug: string) {
  const album = await findAlbum(slug);

  await buildAlbumZip(album);
}
