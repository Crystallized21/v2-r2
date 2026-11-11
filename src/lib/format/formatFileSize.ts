export function formatFileSize( bytes: number ): string {
  const megabytes = bytes / 1024 / 1024;

  if (megabytes >= 1024) {
    return `${(megabytes / 1024).toFixed(1)} GB`;
  }

  return `${Math.round(megabytes)} MB`;
}
