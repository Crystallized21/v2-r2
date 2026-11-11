"use server";

import * as Sentry from "@sentry/nextjs";
import { verify } from "@node-rs/argon2";
import { getAlbumCredentials } from "@/lib/access/getAlbumCredentials";
import { createAlbumSession } from "@/lib/access/albumSession";
import { clearLoginAttempts, registerLoginAttempt } from "@/lib/access/loginAttempts";
import { MAX_ATTEMPTS } from "@/lib/access/config";
import { UnlockState } from "@/types/unlock";

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

    // count first so a locked out visitor can't keep guessing
    const attemptCount = await registerLoginAttempt(album.id);

    if (attemptCount > MAX_ATTEMPTS) {
      return { status: "locked", attempt };
    }

    const passwordMatches = await verify(album.password_hash, password);

    if (!passwordMatches) {
      return { status: "wrong", attempt };
    }

    await clearLoginAttempts(album.id);
    await createAlbumSession(album);

    return { status: "ok", attempt };
  } catch (err) {
    Sentry.captureException(err);
    console.error("Error unlocking album:", err);

    return { status: "failed", attempt };
  }
}
