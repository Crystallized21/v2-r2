import { cache } from "react";
import { db } from "@/lib/clients/db";

// cache() only lasts for one request, so the tab title and the page share one query
export const getAlbumBySlug = cache(async (slug: string) => {
  const { data, error } = await db
    .from("albums")
    .select("id, name, slug, event_date, password_version")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) throw error;

  return data;
});
