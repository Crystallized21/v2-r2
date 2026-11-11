"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import Link from "next/link";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="mt-24 flex max-w-md flex-col gap-4">
      <h1 className="text-4xl font-extralight">Something went wrong</h1>
      <p className="text-muted-foreground">
        This page couldn&apos;t load. It&apos;s usually temporary, so try again in a moment.
      </p>
      <div className="mt-4 flex items-center gap-8">
        <button type="button" onClick={() => retry()} className="min-h-11 text-sm underline-offset-4 hover:underline">
          Try again
        </button>
        <Link href="/" className="min-h-11 content-center text-sm text-muted-foreground hover:text-foreground">
          All albums
        </Link>
      </div>
    </div>
  );
}
