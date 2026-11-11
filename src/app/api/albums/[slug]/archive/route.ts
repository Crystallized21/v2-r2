import { NextResponse } from "next/server";
import { getUnlockedAlbum } from "@/lib/access/getUnlockedAlbum";
import { getAlbumArchive } from "@/lib/photos/getAlbumArchive";
import { signDownloadUrl } from "@/lib/photos/signDownloadUrl";

const NO_STORE = { "Cache-Control": "private, no-store" };

export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/albums/[slug]/archive">,
) {
  const { slug } = await params;

  const { album, response } = await getUnlockedAlbum(slug);

  if (!album) {
    return response;
  }

  const archive = await getAlbumArchive(album.id);

  if (!archive) {
    return NextResponse.json({ error: "No zip for this album yet" }, { status: 404, headers: NO_STORE });
  }

  const url = await signDownloadUrl(archive.r2_key, `${album.name}.zip`);

  return NextResponse.redirect(url, { status: 302, headers: NO_STORE });
}
