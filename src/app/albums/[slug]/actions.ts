"use server";

import * as Sentry from "@sentry/nextjs";
import { verify } from "@node-rs/argon2";
import { getAlbumCredentials } from "@/lib/albumCredentials";
import { createAlbumSession } from "@/lib/albumSession";
import { UnlockState } from "@/types/unlock";

// Called by PasswordForm when the visitor submits a password.
// `slug` is bound in by the form, `formData` holds the typed password.
export async function unlockAlbum(
  slug: string,
  previous: UnlockState,
  formData: FormData,
): Promise<UnlockState> {
  const attempt = previous.attempt + 1;
  const password = formData.get("password");

  if (typeof password !== "string") {
    return { status: "wrong", attempt };
  }

  if (password.length === 0 || password.length > 256) {
    return { status: "wrong", attempt };
  }

  try {
    const album = await getAlbumCredentials(slug);

    if (!album) {
      return { status: "wrong", attempt };
    }

    // TODO(milestone 3): rate limit before verifying

    const passwordMatches = await verify(album.password_hash, password);

    if (!passwordMatches) {
      return { status: "wrong", attempt };
    }

    await createAlbumSession(album);

    return { status: "ok", attempt };
  } catch (err) {
    Sentry.captureException(err);
    console.error("Error unlocking album:", err);

    return { status: "failed", attempt };
  }
}
