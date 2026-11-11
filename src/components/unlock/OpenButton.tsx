import { ArrowRight } from "lucide-react";

export default function OpenButton({ pending }: { pending: boolean }) {
  return (
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
  );
}
