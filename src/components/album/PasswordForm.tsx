"use client";

import { useActionState, useState } from "react";
import { cn } from "@/lib/utils";
import { unlockAlbum } from "@/app/albums/[slug]/actions";
import { UnlockState } from "@/types/unlock";
import PasswordInput from "@/components/album/PasswordInput";
import OpenButton from "@/components/album/OpenButton";
import PasswordError from "@/components/album/PasswordError";

const initialState: UnlockState = { status: "idle", attempt: 0 };

export default function PasswordForm({ slug }: { slug: string }) {
  const [state, formAction, pending] = useActionState(
    unlockAlbum.bind(null, slug),
    initialState,
  );

  // Which attempt the visitor has started retyping after.
  // Used to hide the error message as soon as they type again.
  const [editedAfterAttempt, setEditedAfterAttempt] = useState(0);

  const hasError = state.status === "wrong" || state.status === "failed";
  const hasRetyped = editedAfterAttempt === state.attempt;
  const showError = hasError && !hasRetyped && !pending;

  if (state.status === "ok") {
    return (
      <p className="mt-18 text-lg font-light motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500">
        Opening album…
      </p>
    );
  }

  return (
    <form
      action={formAction}
      className="mt-18 flex max-w-md flex-col gap-3.5 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:fill-mode-both motion-safe:delay-150 motion-safe:duration-700"
    >
      <label htmlFor="password" className="text-sm text-muted-foreground">
        Password
      </label>

      {/* key={attempt} remounts this row on every submit, so the shake replays each time */}
      <div
        key={state.attempt}
        className={cn("flex items-end gap-6", showError && "motion-safe:animate-shake")}
      >
        <PasswordInput
          showError={showError}
          pending={pending}
          onChange={() => setEditedAfterAttempt(state.attempt)}
        />
        <OpenButton pending={pending} />
      </div>

      {showError && <PasswordError status={state.status} />}

      <p className="mt-2 text-sm text-muted-foreground">
        Stays open on this browser for 12 hours.
      </p>
    </form>
  );
}
