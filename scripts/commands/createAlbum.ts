import { confirm, input } from "@inquirer/prompts";
import { db } from "../lib/clients";
import { askPasswordHash } from "../lib/askPasswordHash";
import { buildAlbumZip } from "../lib/buildAlbumZip";
import { findPhotos } from "../lib/findPhotos";
import { readAllPhotoInfo } from "../lib/readAllPhotoInfo";
import { updateSortOrder } from "../lib/updateSortOrder";
import { uploadPhotos } from "../lib/uploadPhotos";

async function isSlugTaken(slug: string) {
  const { data, error } = await db.from("albums").select("id").eq("slug", slug).maybeSingle();

  if (error) throw error;

  return data !== null;
}

function getEarliestDate(takenAts: (string | null)[]) {
  const dates = takenAts.filter((takenAt) => takenAt !== null).sort();

  if (dates.length === 0) {
    return undefined;
  }

  return dates[0].slice(0, 10);
}

export async function createAlbum(folder: string) {
  const paths = await findPhotos(folder);
  console.log(`Reading ${paths.length} photos...`);
  const photos = await readAllPhotoInfo(paths);

  const name = await input({ message: "Album name:", required: true });

  const slug = await input({
    message: "Slug (the bit after /albums/):",
    validate: async (value) => {
      if (!/^[a-zA-Z0-9-]+$/.test(value)) return "Letters, numbers and dashes only";
      if (await isSlugTaken(value)) return "Already used by another album";
      return true;
    },
  });

  const eventDate = await input({
    message: "Event date (YYYY-MM-DD):",
    default: getEarliestDate(photos.map((photo) => photo.takenAt)),
    validate: (value) => /^\d{4}-\d{2}-\d{2}$/.test(value) || "Use YYYY-MM-DD",
  });

  const passwordHash = await askPasswordHash();

  // starts unpublished so nobody sees a half uploaded album
  const { data: album, error } = await db
    .from("albums")
    .insert({ name, slug, event_date: eventDate, password_hash: passwordHash, published: false })
    .select("id, slug")
    .single();

  if (error) throw error;

  console.log(`Uploading ${photos.length} photos...`);

  try {
    await uploadPhotos(album.id, photos);
    await updateSortOrder(album.id);
  } catch (err) {
    console.error(`\nUpload stopped. The album exists but isn't published. To carry on:\n  pnpm album add ${slug} "${folder}"\n`);
    throw err;
  }

  const shouldZip = await confirm({ message: "Build the \"download all\" zip now?", default: true });

  if (shouldZip) {
    await buildAlbumZip({ id: album.id, name });
  }

  const shouldPublish = await confirm({ message: "Publish now?", default: true });

  if (shouldPublish) {
    const { error: publishError } = await db.from("albums").update({ published: true }).eq("id", album.id);

    if (publishError) throw publishError;
  }

  console.log(`\nDone. /albums/${slug}${shouldPublish ? "" : " (not published, run: pnpm album publish " + slug + ")"}`);
}
