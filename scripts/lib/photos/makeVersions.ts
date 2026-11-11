import sharp from "sharp";

// sharp drops all metadata by default, so these have no EXIF at all
export async function makeVersions(filePath: string) {
  const thumbnail = await sharp(filePath)
    .rotate()
    .resize({ width: 800, height: 800, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  const preview = await sharp(filePath)
    .rotate()
    .resize({ width: 2048, height: 2048, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  return { thumbnail, preview };
}
