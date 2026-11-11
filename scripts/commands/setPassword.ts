import { db } from "../lib/setup/clients";
import { askPasswordHash } from "../lib/albums/askPasswordHash";
import { findAlbum } from "../lib/albums/findAlbum";

export async function setPassword(slug: string) {
  const album = await findAlbum(slug);
  console.log(`Changing the password for "${album.name}"`);

  const passwordHash = await askPasswordHash();

  // bumping the version logs out everyone who unlocked it with the old password
  const { error } = await db
    .from("albums")
    .update({ password_hash: passwordHash, password_version: album.password_version + 1 })
    .eq("id", album.id);

  if (error) throw error;

  console.log("Done. Anyone who unlocked it before will need the new password.");
}
