import { S3Client } from "@aws-sdk/client-s3";

if (!process.env.ENDPOINT || !process.env.ACCESS_KEY_ID || !process.env.SECRET_ACCESS_KEY || !process.env.R2_BUCKET) {
  throw new Error("Missing required R2 environment variables.");
}

export const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.ENDPOINT,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

export const BUCKET = process.env.R2_BUCKET;
