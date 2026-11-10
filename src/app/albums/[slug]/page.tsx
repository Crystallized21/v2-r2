import { notFound } from "next/navigation";
import PasswordForm from "@/components/album/PasswordForm";
import { getAlbumBySlug } from "@/lib/albumService";
import NameHeader from "@/components/home/NameHeader";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const album = await getAlbumBySlug(slug);

  if (!album) notFound();

  return (
    <div className="mx-auto w-full max-w-7xl py-8">
      <NameHeader/>
      <Link
        href="/"
        className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to albums
      </Link>

      <h1 className="text-2xl font-semibold">
        {album.name}
      </h1>

      <PasswordForm />
    </div>
  );
}