import "server-only";
import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

if (!process.env.ALBUM_SESSION_SECRET) {
  throw new Error("Missing ALBUM_SESSION_SECRET environment variable.");
}

const secret = new TextEncoder().encode(process.env.ALBUM_SESSION_SECRET);

const SESSION_HOURS = 4;

type SessionAlbum = {
  id: string;
  password_version: number;
};

function getCookieName(albumId: string) {
  return `album_${albumId}`;
}

// The cookie holds a signed token saying "this browser unlocked album X".
// It never contains the password itself.
export async function createAlbumSession(album: SessionAlbum) {
  const token = await new SignJWT({ passwordVersion: album.password_version })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(album.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(secret);

  const cookieStore = await cookies();

  cookieStore.set(getCookieName(album.id), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60,
  });
}

// Changing an album's password_version logs out everyone who unlocked it before.
export async function hasAlbumSession(album: SessionAlbum) {
  const cookieStore = await cookies();
  const token = cookieStore.get(getCookieName(album.id))?.value;

  if (!token) {
    return false;
  }

  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
      subject: album.id,
    });

    return payload.passwordVersion === album.password_version;
  } catch {
    // Expired, tampered with, or signed with an old secret
    return false;
  }
}
