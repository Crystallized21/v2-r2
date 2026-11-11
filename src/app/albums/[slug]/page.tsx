import { notFound } from "next/navigation";
import PasswordForm from "@/components/album/PasswordForm";
import { getAlbumBySlug } from "@/lib/albumService";
import NameHeader from "@/components/home/NameHeader";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { formatPrettyDate } from "@/lib/formatPrettyDate";
import { hasAlbumSession } from "@/lib/albumSession";

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const album = await getAlbumBySlug(slug);

  if (!album) notFound();

  const unlocked = await hasAlbumSession(album);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <NameHeader/>
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
        // TODO(milestone 5): replace with <AlbumGallery />
        <p className="mt-18 text-lg font-light motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500">
          Album unlocked!
        </p>
      ) : (
        <PasswordForm slug={album.slug} />
      )}
    </div>
  );
}