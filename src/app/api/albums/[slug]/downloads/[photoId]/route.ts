import { NextResponse } from "next/server";
import { getAlbumBySlug } from "@/lib/albums/getAlbumBySlug";
import { hasAlbumSession } from "@/lib/albums/albumSession";
import { getPhotoForDownload } from "@/lib/albums/getPhotoForDownload";
import { signDownloadUrl } from "@/lib/albums/signDownloadUrl";

const NO_STORE = { "Cache-Control": "private, no-store" };

export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/albums/[slug]/downloads/[photoId]">,
) {
  const { slug, photoId } = await params;

  const album = await getAlbumBySlug(slug);

  if (!album) {
    return NextResponse.json({ error: "Not found" }, { status: 404, headers: NO_STORE });
  }

  if (!(await hasAlbumSession(album))) {
    return NextResponse.json({ error: "Album is locked" }, { status: 401, headers: NO_STORE });
  }

  const photo = await getPhotoForDownload(album.id, photoId);

  if (!photo) {
    return NextResponse.json({ error: "Not found" }, { status: 404, headers: NO_STORE });
  }

  const url = await signDownloadUrl(photo.r2_key_original, photo.original_filename);

  // the browser follows this to R2, which sends the file as an attachment
  return NextResponse.redirect(url, { status: 302, headers: NO_STORE });
}
