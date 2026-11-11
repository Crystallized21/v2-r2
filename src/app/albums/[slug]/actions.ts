"use server";

import * as Sentry from "@sentry/nextjs";
import { verify } from "@node-rs/argon2";
import { getAlbumCredentials } from "@/lib/albumService";

export type UnlockState = {
  status: "idle" | "error" | "failed" | "ok";
  attempt: number;
};

export async function unlockAlbum(
  slug: string,
  prev: UnlockState,
  formData: FormData,
): Promise<UnlockState> {
  const attempt = prev.attempt + 1;
  const password = formData.get("password");

  if (typeof password !== "string" || password.length === 0 || password.length > 256) {
    return { status: "error", attempt };
  }

  try {
    const album = await getAlbumCredentials(slug);

    if (!album) {
      return { status: "error", attempt };
    }

    // TODO(milestone 3): rate limit before verifying
    const ok = await verify(album.password_hash, password);

    // TODO(milestone 2): set the album session cookie on success
    return { status: ok ? "ok" : "error", attempt };
  } catch (err) {
    Sentry.captureException(err);
    console.error("Error unlocking album:", err);

    return { status: "failed", attempt };
  }
}
