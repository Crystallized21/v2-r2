import { stat } from "node:fs/promises";
import path from "node:path";
import { exiftool, ExifDateTime } from "exiftool-vendored";
import sharp from "sharp";

export type PhotoInfo = {
  path: string;
  filename: string;
  takenAt: string | null;
  width: number;
  height: number;
  sizeBytes: number;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

// camera time with no timezone, e.g. "2026-03-14T15:22:01"
function toLocalTimestamp(date: ExifDateTime) {
  const day = `${date.year}-${pad(date.month)}-${pad(date.day)}`;
  const time = `${pad(date.hour)}:${pad(date.minute)}:${pad(date.second)}`;

  return `${day}T${time}`;
}

export async function readPhotoInfo(filePath: string): Promise<PhotoInfo> {
  const tags = await exiftool.read(filePath);
  const metadata = await sharp(filePath).metadata();
  const file = await stat(filePath);

  let takenAt = null;

  if (tags.DateTimeOriginal instanceof ExifDateTime) {
    takenAt = toLocalTimestamp(tags.DateTimeOriginal);
  }

  // orientations 5-8 are rotated 90 degrees, so width and height swap
  const isRotated = (metadata.orientation ?? 1) >= 5;

  return {
    path: filePath,
    filename: path.basename(filePath),
    takenAt,
    width: isRotated ? metadata.height : metadata.width,
    height: isRotated ? metadata.width : metadata.height,
    sizeBytes: file.size,
  };
}

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
