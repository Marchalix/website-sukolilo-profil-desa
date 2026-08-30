import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_DEFAULT_REGION || "auto",
  endpoint: process.env.AWS_ENDPOINT_URL,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
  forcePathStyle: true,
});

export const BUCKET_NAME =
  process.env.AWS_S3_BUCKET_NAME || "";

// =========================
// UPLOAD
// =========================
export async function uploadToS3(
  key: string,
  body: Buffer,
  contentType: string
) {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
}

// =========================
// GET SIGNED URL
// =========================
export async function getS3Url(key: string) {
  const normalizedKey = key
    .replace(/^\/?uploads\/(berita|galeri|potensi|program|logo)\//, "")
    .replace(/^\/?uploads\//, "");

  return getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: normalizedKey,
    }),
    { expiresIn: 60 * 60 }
  );
}

// =========================
// DELETE
// =========================
export async function deleteFromS3(key: string) {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
  );
}