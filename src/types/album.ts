import { Database } from "./database.types";

export type AlbumRow = Database["public"]["Tables"]["albums"]["Row"];

export type AlbumListRow = Pick<AlbumRow, "id" | "name" | "event_date">;

export type Album = Pick<AlbumRow, "id" | "name"> & {
  eventDate: AlbumRow["event_date"];
};