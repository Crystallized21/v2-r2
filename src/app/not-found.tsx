import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mt-24 flex max-w-md flex-col gap-4">
      <h1 className="text-4xl font-extralight">Nothing here</h1>
      <p className="text-muted-foreground">
        This album doesn&apos;t exist, or it isn&apos;t up yet.
      </p>
      <Link href="/" className="mt-4 min-h-11 content-center self-start text-sm underline-offset-4 hover:underline">
        All albums
      </Link>
    </div>
  );
}
