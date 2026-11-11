import "server-only";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { BUCKET, s3 } from "@/lib/clients/r2";

// filename= for old browsers (ascii only), filename*= for the real name
function getContentDisposition(filename: string) {
  const asciiName = filename.replace(/[^\x20-\x7e]/g, "_").replace(/["\\]/g, "_");

  return `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}

// Only used straight away by a redirect, so it can be short lived
export function signDownloadUrl(key: string, filename: string) {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ResponseContentDisposition: getContentDisposition(filename),
  });

  return getSignedUrl(s3, command, { expiresIn: 60 });
}
