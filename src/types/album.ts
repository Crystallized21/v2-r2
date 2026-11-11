import { Database } from "./database.types";

export type AlbumRow = Database["public"]["Tables"]["albums"]["Row"];

export type Album = Pick<AlbumRow, "id" | "slug" | "name"> & {
  eventDate: AlbumRow["event_date"];
};