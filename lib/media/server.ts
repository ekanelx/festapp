import { createSupabaseServerClient } from "@/lib/supabase/server";

import {
  MEDIA_BUCKET,
  buildMediaStoragePath,
  getUploadedFile,
  isMissingMediaSchemaError,
  normalizeMediaText,
  resolveMediaAsset,
  validateMediaFile,
  type MediaAsset,
  type MediaOwnerType,
} from "@/lib/media/utils";

type SaveEntityCoverMediaParams = {
  ownerType: MediaOwnerType;
  ownerId: string;
  currentAsset: MediaAsset | null;
  fileEntry: FormDataEntryValue | null;
  altTextEntry: FormDataEntryValue | null;
  widthEntry: FormDataEntryValue | null;
  heightEntry: FormDataEntryValue | null;
  removeEntry: FormDataEntryValue | null;
};

type SaveEntityCoverMediaResult = {
  coverMediaId: string | null | undefined;
  error: string | null;
  cleanupOnSuccessMediaId: string | null;
  cleanupOnFailureMediaId: string | null;
};

export async function saveEntityCoverMedia({
  ownerType,
  ownerId,
  currentAsset,
  fileEntry,
  altTextEntry,
  widthEntry,
  heightEntry,
  removeEntry,
}: SaveEntityCoverMediaParams): Promise<SaveEntityCoverMediaResult> {
  const supabase = await createSupabaseServerClient();
  const file = getUploadedFile(fileEntry);
  const altText = normalizeMediaText(altTextEntry);
  const shouldRemove = removeEntry === "on";

  if (!file) {
    if (shouldRemove && currentAsset) {
      return {
        coverMediaId: null,
        error: null,
        cleanupOnSuccessMediaId: currentAsset.id,
        cleanupOnFailureMediaId: null,
      };
    }

    if (currentAsset && currentAsset.altText !== altText) {
      const { error } = await supabase
        .from("media_assets")
        .update({ alt_text: altText })
        .eq("id", currentAsset.id);

      if (error) {
        return {
          coverMediaId: undefined,
          error: isMissingMediaSchemaError(error)
            ? "La migracion de imagenes aun no esta aplicada por completo en este entorno."
            : "La imagen actual no se ha podido actualizar.",
          cleanupOnSuccessMediaId: null,
          cleanupOnFailureMediaId: null,
        };
      }
    }

    return {
      coverMediaId: undefined,
      error: null,
      cleanupOnSuccessMediaId: null,
      cleanupOnFailureMediaId: null,
    };
  }

  const validationError = validateMediaFile(file);

  if (validationError) {
    return {
      coverMediaId: undefined,
      error: validationError,
      cleanupOnSuccessMediaId: null,
      cleanupOnFailureMediaId: null,
    };
  }

  const mediaId = crypto.randomUUID();
  const storagePath = buildMediaStoragePath({
    ownerType,
    ownerId,
    mediaId,
    fileName: file.name,
    mimeType: file.type,
  });
  const { data: authState } = await supabase.auth.getUser();
  const width = parsePositiveInteger(widthEntry);
  const height = parsePositiveInteger(heightEntry);

  const uploadResult = await supabase.storage.from(MEDIA_BUCKET).upload(storagePath, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false,
  });

  if (uploadResult.error) {
    return {
      coverMediaId: undefined,
      error:
        uploadResult.error.message.includes("Bucket not found") ||
        uploadResult.error.message.includes("not found")
          ? "El bucket de imagenes no existe todavia en este entorno. Aplica la migracion de imagenes."
          : "No se ha podido subir la imagen al almacenamiento.",
      cleanupOnSuccessMediaId: null,
      cleanupOnFailureMediaId: null,
    };
  }

  const { error: insertError } = await supabase.from("media_assets").insert({
    id: mediaId,
    bucket_name: MEDIA_BUCKET,
    storage_path: storagePath,
    file_name: file.name,
    mime_type: file.type,
    size_bytes: file.size,
    width,
    height,
    alt_text: altText,
    created_by: authState.user?.id ?? null,
  });

  if (insertError) {
    await supabase.storage.from(MEDIA_BUCKET).remove([storagePath]);

    return {
      coverMediaId: undefined,
      error: isMissingMediaSchemaError(insertError)
        ? "La tabla media_assets o sus relaciones no estan disponibles todavia en este entorno."
        : "La metadata de la imagen no se ha podido guardar.",
      cleanupOnSuccessMediaId: null,
      cleanupOnFailureMediaId: null,
    };
  }

  return {
    coverMediaId: mediaId,
    error: null,
    cleanupOnSuccessMediaId: currentAsset?.id ?? null,
    cleanupOnFailureMediaId: mediaId,
  };
}

export async function deleteMediaAsset(mediaAssetId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: currentAsset, error: currentAssetError } = await supabase
    .from("media_assets")
    .select("id,bucket_name,storage_path,file_name,mime_type,size_bytes,width,height,alt_text")
    .eq("id", mediaAssetId)
    .maybeSingle();

  if (currentAssetError || !currentAsset) {
    return;
  }

  const asset = resolveMediaAsset(currentAsset);

  if (!asset) {
    return;
  }

  await supabase.storage.from(asset.bucketName).remove([asset.storagePath]);
  await supabase.from("media_assets").delete().eq("id", mediaAssetId);
}

function parsePositiveInteger(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}
