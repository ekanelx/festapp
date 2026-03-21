import { getSupabaseEnv } from "@/lib/supabase/env";

export const MEDIA_BUCKET = "media";
export const MEDIA_MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
export const MEDIA_ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export type MediaAssetRecord = {
  id: string;
  bucket_name: string;
  storage_path: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  created_at?: string;
  created_by?: string | null;
};

export type RawMediaAssetRelation = MediaAssetRecord | MediaAssetRecord[] | null | undefined;

export type MediaAsset = {
  id: string;
  bucketName: string;
  storagePath: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  altText: string | null;
  publicUrl: string;
};

export type MediaOwnerType = "festival" | "edition" | "event";

export function isMissingMediaSchemaError(error: { message: string } | null) {
  const message = error?.message ?? "";

  return (
    message.includes("'media_assets'") ||
    message.includes("'cover_media'") ||
    message.includes("'cover_media_id'") ||
    message.includes("media_assets") ||
    message.includes("cover_media_id")
  );
}

const MIME_EXTENSION_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export function unwrapMediaRelation(relation: RawMediaAssetRelation) {
  if (!relation) {
    return null;
  }

  return Array.isArray(relation) ? relation[0] ?? null : relation;
}

export function resolveMediaAsset(relation: RawMediaAssetRelation): MediaAsset | null {
  const record = unwrapMediaRelation(relation);

  if (!record) {
    return null;
  }

  return {
    id: record.id,
    bucketName: record.bucket_name,
    storagePath: record.storage_path,
    fileName: record.file_name,
    mimeType: record.mime_type,
    sizeBytes: Number(record.size_bytes),
    width: record.width ?? null,
    height: record.height ?? null,
    altText: record.alt_text ?? null,
    publicUrl: buildStoragePublicUrl(record.bucket_name, record.storage_path),
  };
}

export function buildStoragePublicUrl(bucketName: string, storagePath: string) {
  const { url } = getSupabaseEnv();
  const normalizedPath = storagePath
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${url}/storage/v1/object/public/${bucketName}/${normalizedPath}`;
}

export function formatMediaFileSize(sizeBytes: number) {
  if (sizeBytes >= 1024 * 1024) {
    return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  if (sizeBytes >= 1024) {
    return `${Math.round(sizeBytes / 1024)} KB`;
  }

  return `${sizeBytes} B`;
}

export function getMediaHelpText() {
  return "Formatos recomendados: JPG, PNG, WebP o AVIF. Peso maximo 5 MB.";
}

export function normalizeMediaText(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

export function getUploadedFile(value: FormDataEntryValue | null) {
  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  return value;
}

export function validateMediaFile(file: File) {
  if (!MEDIA_ACCEPTED_MIME_TYPES.includes(file.type as (typeof MEDIA_ACCEPTED_MIME_TYPES)[number])) {
    return "El formato de imagen no es compatible. Usa JPG, PNG, WebP o AVIF.";
  }

  if (file.size > MEDIA_MAX_FILE_SIZE_BYTES) {
    return "La imagen supera el maximo recomendado de 5 MB.";
  }

  return null;
}

export function buildMediaStoragePath({
  ownerType,
  ownerId,
  mediaId,
  fileName,
  mimeType,
}: {
  ownerType: MediaOwnerType;
  ownerId: string;
  mediaId: string;
  fileName: string;
  mimeType: string;
}) {
  const extension = getFileExtension(fileName, mimeType);
  return `${ownerType}s/${ownerId}/cover/${mediaId}.${extension}`;
}

function getFileExtension(fileName: string, mimeType: string) {
  const sanitizedName = fileName.trim().toLowerCase();
  const parts = sanitizedName.split(".");
  const lastPart = parts.at(-1);

  if (lastPart && /^[a-z0-9]{2,5}$/.test(lastPart)) {
    return lastPart;
  }

  return MIME_EXTENSION_MAP[mimeType] ?? "bin";
}
