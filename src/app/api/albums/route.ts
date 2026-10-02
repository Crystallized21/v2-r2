import * as Sentry from "@sentry/nextjs";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  try {
    Sentry.logger.info("Fetching albums from Supabase...");

    const { data, error } = await supabase
      .from("albums")
      .select("id, name, event_date")
      .eq("published", true);

    if (error) {
      throw error;
    }

    const albums = data.map((row) => ({
      id: row.id,
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