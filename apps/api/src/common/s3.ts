import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: process.env.S3_REGION || "ap-south-1",
  endpoint: process.env.S3_ENDPOINT || "https://jvbwajcypzryqbvmuirv.storage.supabase.co/storage/v1/s3",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_SECRET_KEY || "",
  },
  forcePathStyle: true,
});

export const MEDIA_BUCKET = process.env.S3_MEDIA_BUCKET || "systrol-media";
export const DOCUMENTS_BUCKET = process.env.S3_BUCKET || "systrol-documents";

export function getPublicMediaUrl(s3Key: string): string {
  const endpoint = process.env.S3_ENDPOINT || "https://jvbwajcypzryqbvmuirv.storage.supabase.co/storage/v1/s3";
  const urlObj = new URL(endpoint);
  const host = urlObj.host;
  const protocol = urlObj.protocol;
  return `${protocol}//${host}/storage/v1/object/public/${MEDIA_BUCKET}/${s3Key}`;
}
