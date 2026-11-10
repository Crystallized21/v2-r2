import Link from "next/link";
import { fetchAlbums, groupAlbumsByDate } from "@/lib/albumService";
import { formatPrettyDate } from "@/lib/formatPrettyDate";

export default async function AlbumList() {
  const albums = await fetchAlbums();
  const groupedAlbums = groupAlbumsByDate(albums);

  return (
    <div className="flex flex-col text-foreground">
      {Object.entries(groupedAlbums).map(( [dateKey, dateAlbums] ) => (
        <div key={dateKey}>
          <h2 className="text-lg py-2 text-gray-500 font-light">
            {formatPrettyDate(dateKey)}
          </h2>
          <div className="flex flex-col">
            {dateAlbums.map(( album ) => (
              <Link key={album.id} href={`/albums/${album.slug}`}>
                <h1 className="text-2xl py-2 relative block w-fit cursor-pointer group">
                  {album.name}
                  <span
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-current group-hover:w-full transition-all duration-300"></span>
                </h1>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}