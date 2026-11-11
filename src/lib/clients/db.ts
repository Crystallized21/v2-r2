import "server-only";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
  throw new Error("Missing required Supabase environment variables.");
}

// secret key bypasses RLS, server only
export const db = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
);
