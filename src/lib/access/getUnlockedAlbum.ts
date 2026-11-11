import "server-only";
import { NextResponse } from "next/server";
import { getAlbumBySlug } from "@/lib/albums/getAlbumBySlug";
import { hasAlbumSession } from "@/lib/access/albumSession";

type Album = NonNullable<Awaited<ReturnType<typeof getAlbumBySlug>>>;

type UnlockedAlbumResult =
  | { album: Album; response: null }
  | { album: null; response: NextResponse };

const NO_STORE = { "Cache-Control": "private, no-store" };

// The check every protected API route starts with, kept in one place so a new
// route can't forget half of it. If album is null, return the response as is.
export async function getUnlockedAlbum(slug: string): Promise<UnlockedAlbumResult> {
  const album = await getAlbumBySlug(slug);

  if (!album) {
    const response = NextResponse.json({ error: "Not found" }, { status: 404, headers: NO_STORE });
    return { album: null, response };
  }

  if (!(await hasAlbumSession(album))) {
    const response = NextResponse.json({ error: "Album is locked" }, { status: 401, headers: NO_STORE });
    return { album: null, response };
  }

  return { album, response: null };
}
