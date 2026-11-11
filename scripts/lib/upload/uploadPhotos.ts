import { PhotoInfo } from "../photos/readPhotoInfo";
import { uploadPhoto } from "./uploadPhoto";

const AT_ONCE = 4;

export async function uploadPhotos(albumId: string, photos: PhotoInfo[]) {
  let done = 0;

  for (let i = 0; i < photos.length; i += AT_ONCE) {
    const batch = photos.slice(i, i + AT_ONCE);

    await Promise.all(batch.map(async (photo) => {
      await uploadPhoto(albumId, photo);
      done++;
      console.log(`  ${done}/${photos.length}  ${photo.filename}`);
    }));
  }
}
