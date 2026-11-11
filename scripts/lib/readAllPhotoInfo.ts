import { PhotoInfo, readPhotoInfo } from "./readPhotoInfo";

export async function readAllPhotoInfo(paths: string[]) {
  const photos: PhotoInfo[] = [];

  for (const filePath of paths) {
    photos.push(await readPhotoInfo(filePath));
  }

  const withoutTime = photos.filter((photo) => photo.takenAt === null);

  if (withoutTime.length > 0) {
    console.log(`${withoutTime.length} photos have no capture time, they'll go at the end by filename`);
  }

  return photos;
}
