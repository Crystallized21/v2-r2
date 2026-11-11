"use client";

import { useActionState, useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type UnlockState = {
  status: "idle" | "error" | "ok";
  attempt: number;
};

async function fakeUnlock(prev: UnlockState, formData: FormData): Promise<UnlockState> {
  await new Promise((resolve) => setTimeout(resolve, 900));
  const ok = formData.get("password") === "spectra";
  return { status: ok ? "ok" : "error", attempt: prev.attempt + 1 };
}

export default function PasswordForm() {
  const [state, formAction, pending] = useActionState<UnlockState, FormData>(fakeUnlock, {
    status: "idle",
    attempt: 0,
  });
  // Hide the error as soon as the visitor starts retyping
  const [editedAfter, setEditedAfter] = useState(0);
  const showError = state.status === "error" && editedAfter !== state.attempt && !pending;

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

      <div
        key={state.attempt}
        className={cn("flex items-end gap-6", showError && "motion-safe:animate-shake")}
      >
        <div className="relative flex-1 overflow-hidden">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            disabled={pending}
            onChange={() => setEditedAfter(state.attempt)}
            aria-invalid={showError}
            aria-describedby={showError ? "password-error" : undefined}
            className="peer h-11 w-full border-0 border-b border-border bg-transparent p-0 text-xl font-light tracking-widest outline-none transition-opacity disabled:opacity-50"
          />
          {/* Focus line grows from the left over the resting border */}
          <span
            aria-hidden="true"
            className={cn(
              "absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-foreground transition-transform duration-500 peer-focus:scale-x-100",
              showError && "scale-x-100 bg-destructive",
              pending && "opacity-0",
            )}
          />
          {pending && (
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-px w-1/3 bg-foreground motion-safe:animate-indeterminate"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={pending}
          className="group inline-flex h-11 cursor-pointer items-center gap-2 text-base transition-colors disabled:cursor-default disabled:text-muted-foreground"
        >
          <span className="relative">
            {pending ? "Opening" : "Open"}
            <span className="absolute bottom-0 left-0 h-px w-0 bg-current transition-all duration-300 group-hover:w-full group-disabled:w-0" />
          </span>
          <ArrowRight
            size={16}
            strokeWidth={1.5}
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1 group-disabled:translate-x-0"
          />
        </button>
      </div>

      {showError && (
        <p
          id="password-error"
          role="alert"
          className="text-sm text-destructive motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-1 motion-safe:duration-300"
        >
          That isn&apos;t it. Check the message the password came in.
        </p>
      )}

      <p className="mt-2 text-sm text-muted-foreground">
        Stays open on this browser for 12 hours.
      </p>
    </form>
  );
}
