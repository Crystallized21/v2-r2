import AlbumViewer from "@/components/gallery/AlbumViewer";
import { getGalleryPhotos } from "@/lib/photos/getGalleryPhotos";

type AlbumPhotosProps = {
  albumId: string;
  albumName: string;
  albumSlug: string;
};

// Its own component so the page can show the title straight away
// and only the grid waits for the signed URLs (see the Suspense in page.tsx).
// Only render this after checking the album session.
export default async function AlbumPhotos({ albumId, albumName, albumSlug }: AlbumPhotosProps) {
  const photos = await getGalleryPhotos(albumId);

  return <AlbumViewer photos={photos} albumName={albumName} albumSlug={albumSlug} />;
}
