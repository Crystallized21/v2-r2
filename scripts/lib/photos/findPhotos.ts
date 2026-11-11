import { readdir, stat } from "node:fs/promises";
import path from "node:path";

async function checkIsFolder(folder: string) {
  try {
    const info = await stat(folder);

    if (!info.isDirectory()) {
      throw new Error(`${folder} is a file, not a folder`);
    }
  } catch (err) {
    if ((err as { code?: string }).code === "ENOENT") {
      throw new Error(`Folder not found: ${folder}`);
    }

    throw err;
  }
}

export async function findPhotos(folder: string) {
  await checkIsFolder(folder);

  const filenames = await readdir(folder);

  const jpegs = filenames.filter((name) => /\.jpe?g$/i.test(name));
  const others = filenames.filter((name) => !/\.jpe?g$/i.test(name) && !name.startsWith("."));

  if (others.length > 0) {
    console.log(`Ignoring ${others.length} non-JPEG files: ${others.join(", ")}`);
  }

  if (jpegs.length === 0) {
    throw new Error(`No JPEGs found in ${folder}`);
  }

  return jpegs.sort().map((name) => path.join(folder, name));
}
