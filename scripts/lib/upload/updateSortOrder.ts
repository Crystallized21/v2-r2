import { db } from "../setup/clients";

type SortablePhoto = {
  id: string;
  taken_at: string | null;
  original_filename: string;
};

// capture time first, filename breaks ties, photos without a time go last
function comparePhotos(a: SortablePhoto, b: SortablePhoto) {
  if (a.taken_at && b.taken_at && a.taken_at !== b.taken_at) {
    return a.taken_at < b.taken_at ? -1 : 1;
  }

  if (a.taken_at && !b.taken_at) return -1;
  if (!a.taken_at && b.taken_at) return 1;

  return a.original_filename.localeCompare(b.original_filename);
}

// redoes the whole album so photos added later slot in at the right time
export async function updateSortOrder(albumId: string) {
  const { data: photos, error } = await db
    .from("photos")
    .select("id, taken_at, original_filename")
    .eq("album_id", albumId);

  if (error) throw error;

  photos.sort(comparePhotos);

  for (let index = 0; index < photos.length; index++) {
    const { error: updateError } = await db
      .from("photos")
      .update({ sort_order: index })
      .eq("id", photos[index].id);

    if (updateError) throw updateError;
  }
}
