import { cn } from "@/lib/utils";

type PasswordInputProps = {
  showError: boolean;
  pending: boolean;
  onChange: () => void;
};

export default function PasswordInput({ showError, pending, onChange }: PasswordInputProps) {
  return (
    <div className="relative flex-1 overflow-hidden">
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        disabled={pending}
        onChange={onChange}
        aria-invalid={showError}
        aria-describedby={showError ? "password-error" : undefined}
        className="peer h-11 w-full border-0 border-b border-border bg-transparent p-0 text-xl font-light tracking-widest outline-none transition-opacity disabled:opacity-50"
      />

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
  );
}
