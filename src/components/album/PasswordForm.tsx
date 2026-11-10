"use client";

import { useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PasswordForm() {
  const [visible, setVisible] = useState(false);

  return (
    <form className="w-lg mt-6 border-t pt-7">
      <p className="mb-6 text-sm text-muted-foreground">
        Enter the password shared with you to open this album.
      </p>

      <label htmlFor="password" className="mb-2 block text-sm font-medium">
        Album password
      </label>

      <div className="relative">
        <Input
          id="password"
          name="password"
          type={visible ? "text" : "password"}
          placeholder="Enter password"
          autoComplete="current-password"
          required
          className="h-12 pr-12"
        />

        <button
          type="button"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <Button type="button" className="mt-5 h-12 w-full gap-2">
        Open album
        <ArrowRight size={16} />
      </Button>

      <p className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <LockKeyhole size={14} />
        Access is remembered for 12 hours on this browser.
      </p>
    </form>
  );
}