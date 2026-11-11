import "server-only";
import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { db } from "@/lib/clients/db";
import { WINDOW_MINUTES } from "@/lib/albums/rateLimitConfig";

async function getIpHash() {
  const headerStore = await headers();

  // On Vercel the first x-forwarded-for entry is the real client IP
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  return createHmac("sha256", process.env.ALBUM_SESSION_SECRET!)
    .update(ip)
    .digest("hex");
}

export async function registerLoginAttempt(albumId: string) {
  const { data, error } = await db.rpc("register_login_attempt", {
    p_album_id: albumId,
    p_ip_hash: await getIpHash(),
    p_window_minutes: WINDOW_MINUTES,
  });

  if (error) throw error;

  return data;
}

export async function clearLoginAttempts(albumId: string) {
  const { error } = await db
    .from("login_attempts")
    .delete()
    .eq("album_id", albumId)
    .eq("ip_hash", await getIpHash());

  if (error) throw error;
}
