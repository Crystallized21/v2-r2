import { NextResponse } from "next/server";
import { getUnlockedAlbum } from "@/lib/access/getUnlockedAlbum";
import { getPhotoForDownload } from "@/lib/photos/getPhotoForDownload";
import { signDownloadUrl } from "@/lib/photos/signDownloadUrl";

const NO_STORE = { "Cache-Control": "private, no-store" };

export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/albums/[slug]/downloads/[photoId]">,
) {
  const { slug, photoId } = await params;

  const { album, response } = await getUnlockedAlbum(slug);

  if (!album) {
    return response;
  }

  const photo = await getPhotoForDownload(album.id, photoId);

  if (!photo) {
    return NextResponse.json({ error: "Not found" }, { status: 404, headers: NO_STORE });
  }

  const url = await signDownloadUrl(photo.r2_key_original, photo.original_filename);

  // the browser follows this to R2, which sends the file as an attachment
  return NextResponse.redirect(url, { status: 302, headers: NO_STORE });
}
