import { notFound } from "next/navigation";
import PasswordForm from "@/components/unlock/PasswordForm";
import { getAlbumBySlug } from "@/lib/albums/getAlbumBySlug";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formatPrettyDate } from "@/lib/format/formatPrettyDate";
import { hasAlbumSession } from "@/lib/access/albumSession";
import { getGalleryPhotos } from "@/lib/photos/getGalleryPhotos";
import { getAlbumArchive } from "@/lib/photos/getAlbumArchive";
import AlbumViewer from "@/components/gallery/AlbumViewer";

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const album = await getAlbumBySlug(slug);

  if (!album) notFound();

  const unlocked = await hasAlbumSession(album);
  const photos = unlocked ? await getGalleryPhotos(album.id) : [];
  const archive = unlocked ? await getAlbumArchive(album.id) : null;

  return (
    <>
      <Link
        href="/"
        className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All albums
      </Link>

      <div className="mt-24 flex flex-col gap-3 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-700">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {formatPrettyDate(album.event_date)}
        </p>
        <h1 className="text-6xl font-extralight leading-tight">
          {album.name}
        </h1>
      </div>

      {unlocked ? (
        <AlbumViewer
          photos={photos}
          albumName={album.name}
          albumSlug={album.slug}
          archiveSizeBytes={archive?.size_bytes ?? null}
        />
      ) : (
        <PasswordForm slug={album.slug} />
      )}
    </>
  );
}
