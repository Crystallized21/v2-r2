import * as Sentry from "@sentry/nextjs";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { AlbumListRow } from "@/types/album";

export async function GET() {
  try {
    Sentry.logger.info("Fetching albums from Supabase...");

    const { data, error } = await db
      .from("albums")
      .select("id, slug, name, event_date")
      .eq("published", true);

    if (error) {
      throw error;
    }

    const albums = data.map((row: AlbumListRow) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      eventDate: row.event_date,
    }));

    return NextResponse.json(albums);
  } catch (error) {
    Sentry.captureException(error);
    console.error("Error listing albums:", error);

    return NextResponse.json(
      { error: "Could not list albums" },
      { status: 500 }
    );
  }
}