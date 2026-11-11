import { PutObjectCommand } from "@aws-sdk/client-s3";
import { BUCKET, s3 } from "./clients";

export async function uploadToR2(key: string, body: Buffer, contentType: string) {
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: "private, max-age=86400",
  }));
}
