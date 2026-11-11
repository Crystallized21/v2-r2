import { readFile, rm } from "node:fs/promises";
import path from "node:path";
import { db } from "./clients";
import { makeVersions } from "./makeVersions";
import { PhotoInfo } from "./readPhotoInfo";
import { stripGps } from "./stripGps";
import { uploadToR2 } from "./uploadToR2";

// "IMG 0012.jpg" -> "IMG-0012"
function toKeyName(filename: string) {
  const withoutExtension = path.parse(filename).name;

  return withoutExtension.replace(/[^a-zA-Z0-9_-]/g, "-");
}

// Uploads to R2 first and inserts the row last. If anything fails halfway,
// there's no row, so the next `pnpm album add` redoes this photo and the
// same R2 keys just get overwritten.
export async function uploadPhoto(albumId: string, photo: PhotoInfo) {
  const folder = `albums/${albumId}/${toKeyName(photo.filename)}`;
  const keys = {
    original: `${folder}/original.jpg`,
    preview: `${folder}/preview.webp`,
    thumbnail: `${folder}/thumbnail.webp`,
  };

  const strippedPath = await stripGps(photo.path);

  try {
    const original = await readFile(strippedPath);
    const { thumbnail, preview } = await makeVersions(strippedPath);

    await uploadToR2(keys.original, original, "image/jpeg");
    await uploadToR2(keys.preview, preview, "image/webp");
    await uploadToR2(keys.thumbnail, thumbnail, "image/webp");

    const { error } = await db.from("photos").insert({
      album_id: albumId,
      original_filename: photo.filename,
      taken_at: photo.takenAt,
      width: photo.width,
      height: photo.height,
      size_bytes: original.length,
      r2_key_original: keys.original,
      r2_key_preview: keys.preview,
      r2_key_thumbnail: keys.thumbnail,
    });

    if (error) throw error;
  } finally {
    await rm(strippedPath, { force: true });
  }
}
