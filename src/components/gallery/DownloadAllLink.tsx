import { Download } from "lucide-react";
import { formatFileSize } from "@/lib/format/formatFileSize";

type DownloadAllLinkProps = {
  albumSlug: string;
  sizeBytes: number;
};

// A plain link is enough, the route redirects to R2 which sends the zip as a download.
// The only filled element on the page, so it's the first thing people find.
export default function DownloadAllLink({ albumSlug, sizeBytes }: DownloadAllLinkProps) {
  return (
    <a
      href={`/api/albums/${albumSlug}/archive`}
      className="group inline-flex h-11 shrink-0 items-center gap-2.5 bg-foreground px-5 text-sm text-background transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
    >
      <Download size={16} strokeWidth={1.75} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-0.5" />
      Download all
      <span className="opacity-60">{formatFileSize(sizeBytes)}</span>
    </a>
  );
}
