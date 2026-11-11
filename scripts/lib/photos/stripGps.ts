import { copyFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import os from "node:os";
import path from "node:path";
import { exiftool } from "exiftool-vendored";

// Returns a temp copy with GPS removed. Doesn't re-compress, and keeps
// capture time, camera, lens etc. Caller deletes the copy when done.
export async function stripGps(filePath: string) {
  const copyPath = path.join(os.tmpdir(), `${randomUUID()}.jpg`);

  await copyFile(filePath, copyPath);

  await exiftool.write(copyPath, {}, {
    writeArgs: ["-gps:all=", "-xmp:geotag=", "-overwrite_original"],
  });

  return copyPath;
}
