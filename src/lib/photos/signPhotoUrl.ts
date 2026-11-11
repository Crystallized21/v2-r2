import "server-only";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { BUCKET, s3 } from "@/lib/clients/r2";

const ONE_HOUR_MS = 60 * 60 * 1000;

// Signing from the start of the hour means the same photo gets the same URL for
// that whole hour, so browsers can cache it instead of downloading it again.
// Valid for 2 hours from then, so there's always at least an hour left.
export function signPhotoUrl(key: string) {
  const startOfHour = new Date(Math.floor(Date.now() / ONE_HOUR_MS) * ONE_HOUR_MS);

  return getSignedUrl(s3, new GetObjectCommand({ Bucket: BUCKET, Key: key }), {
    signingDate: startOfHour,
    expiresIn: 2 * 60 * 60,
  });
}
