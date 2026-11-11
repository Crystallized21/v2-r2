import path from "node:path";
import { confirm } from "@inquirer/prompts";
import { buildAlbumZip } from "../lib/buildAlbumZip";
import { db } from "../lib/clients";
import { findAlbum } from "../lib/findAlbum";
import { findPhotos } from "../lib/findPhotos";
import { readAllPhotoInfo } from "../lib/readAllPhotoInfo";
import { updateSortOrder } from "../lib/updateSortOrder";
import { uploadPhotos } from "../lib/uploadPhotos";

async function getUploadedFilenames(albumId: string) {
  const { data, error } = await db.from("photos").select("original_filename").eq("album_id", albumId);

  if (error) throw error;

  return new Set(data.map((photo) => photo.original_filename));
}

export async function addPhotos(slug: string, folder: string) {
  const album = await findAlbum(slug);
  const paths = await findPhotos(folder);
  const uploaded = await getUploadedFilenames(album.id);

  // matched by filename, so re-running after a crash only uploads what's missing
  const newPaths = paths.filter((filePath) => !uploaded.has(path.basename(filePath)));
  const skipped = paths.length - newPaths.length;

  if (skipped > 0) {
    console.log(`Skipping ${skipped} photos already in "${album.name}"`);
  }

  if (newPaths.length === 0) {
    console.log("Nothing new to upload.");
    return;
  }

  console.log(`Reading ${newPaths.length} photos...`);
  const photos = await readAllPhotoInfo(newPaths);

  console.log(`Uploading ${photos.length} photos to "${album.name}"...`);
  await uploadPhotos(album.id, photos);
  await updateSortOrder(album.id);

  // the old zip doesn't have the new photos
  const shouldZip = await confirm({ message: "Rebuild the \"download all\" zip?", default: true });

  if (shouldZip) {
    await buildAlbumZip(album);
  }

  console.log(`\nDone. Added ${photos.length} photos to /albums/${album.slug}${album.published ? "" : " (not published)"}`);
}
