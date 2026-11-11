import { once } from "node:events";
import { PassThrough, Readable } from "node:stream";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { ZipArchive } from "archiver";
import { BUCKET, db, s3 } from "./clients";

type ZipAlbum = {
  id: string;
  name: string;
};

async function getOriginals(albumId: string) {
  const { data, error } = await db
    .from("photos")
    .select("original_filename, r2_key_original")
    .eq("album_id", albumId)
    .order("sort_order");

  if (error) throw error;

  return data;
}

async function saveArchiveRow(albumId: string, key: string, sizeBytes: number) {
  const { error: deleteError } = await db.from("album_archives").delete().eq("album_id", albumId);

  if (deleteError) throw deleteError;

  const { error } = await db.from("album_archives").insert({
    album_id: albumId,
    r2_key: key,
    size_bytes: sizeBytes,
    status: "ready",
    generated_at: new Date().toISOString(),
  });

  if (error) throw error;
}

// Streams every original from R2 into a zip that's uploaded back to R2 as it's built,
// so nothing big is held in memory or written to disk. Uses the R2 copies because
// those are the ones with GPS removed.
export async function buildAlbumZip(album: ZipAlbum) {
  const photos = await getOriginals(album.id);

  if (photos.length === 0) {
    console.log("No photos, skipping the zip.");
    return;
  }

  const key = `albums/${album.id}/archive.zip`;

  // JPEGs don't compress, so store them as-is
  const archive = new ZipArchive({ store: true });

  // archiver uses its own stream class that the uploader doesn't recognise,
  // so pass it through a plain Node stream
  const body = new PassThrough();
  archive.pipe(body);
  archive.on("error", (err) => body.destroy(err));

  // R2 only replaces the old zip once this finishes, so downloads keep working meanwhile
  const upload = new Upload({
    client: s3,
    params: { Bucket: BUCKET, Key: key, Body: body, ContentType: "application/zip" },
    partSize: 16 * 1024 * 1024,
    queueSize: 4,
  });

  const uploaded = upload.done();

  // if the upload dies, stop the archive too, otherwise the loop below waits forever
  uploaded.catch((err) => archive.destroy(err));

  console.log(`Zipping ${photos.length} photos...`);

  for (let index = 0; index < photos.length; index++) {
    const photo = photos[index];
    const object = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: photo.r2_key_original }));

    archive.append(object.Body as Readable, { name: photo.original_filename });

    // one photo at a time, so we don't open hundreds of downloads at once
    await once(archive, "entry");
    console.log(`  ${index + 1}/${photos.length}  ${photo.original_filename}`);
  }

  await archive.finalize();
  await uploaded;

  const sizeBytes = archive.pointer();
  await saveArchiveRow(album.id, key, sizeBytes);

  console.log(`Zip ready, ${(sizeBytes / 1024 / 1024).toFixed(0)} MB`);
}
