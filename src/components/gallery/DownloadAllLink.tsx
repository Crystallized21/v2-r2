import { Download } from "lucide-react";
import { formatFileSize } from "@/lib/format/formatFileSize";

type DownloadAllLinkProps = {
  albumSlug: string;
  sizeBytes: number;
};

// A plain link is enough, the route redirects to R2 which sends the zip as a download
export default function DownloadAllLink({ albumSlug, sizeBytes }: DownloadAllLinkProps) {
  return (
    <a
      href={`/api/albums/${albumSlug}/archive`}
      className="group inline-flex min-h-11 items-center gap-2 text-sm"
    >
      <Download size={16} strokeWidth={1.5} aria-hidden="true" />
      <span className="relative">
        Download all
        <span className="absolute bottom-0 left-0 h-px w-0 bg-current transition-all duration-300 group-hover:w-full" />
      </span>
      <span className="text-muted-foreground">{formatFileSize(sizeBytes)}</span>
    </a>
  );
}
