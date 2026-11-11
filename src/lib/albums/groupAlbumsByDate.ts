import { Album } from "@/types/album";

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
