"use client";

import { useLinkStatus } from "next/link";
import { cn } from "cn";

type LinkUnderlineProps = {
  // also grow a full underline on hover, like the album names on the home page
  growOnHover?: boolean;
  // the line's thickness
  className?: string;
};

// Goes inside a <Link>, in a parent with `relative`. While the next page loads, a short
// line sweeps along it, the same one the password form shows while checking.
// Waits 150ms before showing so quick navigations don't flash it.
export default function LinkUnderline({ growOnHover = false, className = "h-0.5" }: LinkUnderlineProps) {
  const { pending } = useLinkStatus();

  return (
    <span aria-hidden="true" className={cn("pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden", className)}>
      {growOnHover && (
        <span
          className={cn(
            "absolute inset-y-0 left-0 w-0 bg-current transition-all duration-300 group-hover:w-full",
            pending && "opacity-0 delay-150",
          )}
        />
      )}
      <span
        className={cn(
          "absolute inset-y-0 left-0 w-1/3 bg-current opacity-0 transition-opacity",
          pending && "opacity-100 delay-150 motion-safe:animate-indeterminate motion-reduce:w-full",
        )}
      />
    </span>
  );
}
