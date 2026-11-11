import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PasswordForm from "@/components/unlock/PasswordForm";
import { getAlbumBySlug } from "@/lib/albums/getAlbumBySlug";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formatPrettyDate } from "@/lib/format/formatPrettyDate";
import { hasAlbumSession } from "@/lib/access/albumSession";
import { getAlbumArchive } from "@/lib/photos/getAlbumArchive";
import AlbumPhotos from "@/components/gallery/AlbumPhotos";
import GallerySkeleton from "@/components/gallery/GallerySkeleton";
import DownloadAllLink from "@/components/gallery/DownloadAllLink";

export async function generateMetadata({ params }: PageProps<"/albums/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const album = await getAlbumBySlug(slug);

  // a missing album gets its title from not-found.tsx
  if (!album) {
    return {};
  }

  return { title: album.name };
}

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const album = await getAlbumBySlug(slug);

  if (!album) notFound();

  const unlocked = await hasAlbumSession(album);
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

      <div className="mt-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-6 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-700">
        <div className="flex flex-col gap-3">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {formatPrettyDate(album.event_date)}
          </p>
          <h1 className="text-6xl font-extralight leading-tight">
            {album.name}
          </h1>
        </div>

        {archive && archive.size_bytes !== null && (
          <DownloadAllLink albumSlug={album.slug} sizeBytes={archive.size_bytes} />
        )}
      </div>

      {unlocked ? (
        <Suspense fallback={<GallerySkeleton />}>
          <AlbumPhotos albumId={album.id} albumName={album.name} albumSlug={album.slug} />
        </Suspense>
      ) : (
        <PasswordForm slug={album.slug} />
      )}
    </>
  );
}
