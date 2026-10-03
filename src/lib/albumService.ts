import * as Sentry from "@sentry/nextjs";
import { Album } from "@/types/album";

export async function fetchAlbums(): Promise<Album[]> {
  try {
    const res = await fetch(`${process.env.API_URL}/api/albums`, {
      cache: "no-store",
    });

    if (!res.ok) {
      Sentry.logger.error(
        Sentry.logger.fmt`Failed to fetch albums. API returned status ${res.status}`
      );
      throw new Error(`Failed to fetch albums. API returned status ${res.status}`);
    }

    const data: Album[] = await res.json();
    Sentry.logger.info("[Server] Albums fetched successfully");
    return data ?? [];
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    Sentry.logger.error(Sentry.logger.fmt`[Server] Failed to fetch albums: '${message}'`);
    Sentry.captureException(err);

    console.error(err);
    throw err;
  }
}

export function groupAlbumsByDate( albums: Album[] ): Record<string, Album[]> {
  return albums.reduce(( acc, album ) => {
    const dateKey = album.eventDate;

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(album);

    return acc;
  }, {} as Record<string, Album[]>);
}