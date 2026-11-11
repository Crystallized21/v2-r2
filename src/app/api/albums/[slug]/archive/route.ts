import { NextResponse } from "next/server";
import { getAlbumBySlug } from "@/lib/albums/getAlbumBySlug";
import { hasAlbumSession } from "@/lib/albums/albumSession";
import { getAlbumArchive } from "@/lib/albums/getAlbumArchive";
import { signDownloadUrl } from "@/lib/albums/signDownloadUrl";

const NO_STORE = { "Cache-Control": "private, no-store" };

export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/albums/[slug]/archive">,
) {
  const { slug } = await params;

  const album = await getAlbumBySlug(slug);

  if (!album) {
    return NextResponse.json({ error: "Not found" }, { status: 404, headers: NO_STORE });
  }

  if (!(await hasAlbumSession(album))) {
    return NextResponse.json({ error: "Album is locked" }, { status: 401, headers: NO_STORE });
  }

  const archive = await getAlbumArchive(album.id);

  if (!archive) {
    return NextResponse.json({ error: "No zip for this album yet" }, { status: 404, headers: NO_STORE });
  }

  const url = await signDownloadUrl(archive.r2_key, `${album.name}.zip`);

  return NextResponse.redirect(url, { status: 302, headers: NO_STORE });
}
