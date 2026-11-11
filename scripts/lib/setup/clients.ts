import { createClient } from "@supabase/supabase-js";
import { S3Client } from "@aws-sdk/client-s3";
import { Database } from "@/types/database.types";

// can't reuse src/lib/clients, they import "server-only" which throws outside Next.
// env vars are checked in album.ts before this file is loaded.
export const db = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

export const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.ENDPOINT!,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

export const BUCKET = process.env.R2_BUCKET!;
