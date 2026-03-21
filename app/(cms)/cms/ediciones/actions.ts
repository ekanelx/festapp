"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireCmsRole } from "@/lib/cms/auth";
import { deleteMediaAsset, saveEntityCoverMedia } from "@/lib/media/server";
import { isMissingMediaSchemaError, resolveMediaAsset } from "@/lib/media/utils";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const EDITION_STATUS_VALUES = new Set(["draft", "published", "archived"]);

function buildEditionUrl(editionId: string, params?: Record<string, string>) {
  const query = new URLSearchParams(params);
  const suffix = query.toString();

  return suffix ? `/cms/ediciones/${editionId}?${suffix}` : `/cms/ediciones/${editionId}`;
}

function normalizeText(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function normalizeSlug(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return normalized.length ? normalized : null;
}

function normalizeYear(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return null;
  }

  const year = Number(value);
  return Number.isInteger(year) ? year : null;
}

function hasInvalidEditionRange(startsOn: string, endsOn: string) {
  return endsOn < startsOn;
}

export async function updateEditionAction(formData: FormData) {
  await requireCmsRole("admin");

  const editionId = normalizeText(formData.get("edition_id"));

  if (!editionId) {
    redirect("/cms/festivales");
  }

  const supabase = await createSupabaseServerClient();
  const primaryEdition = await supabase
    .from("editions")
    .select(
      "id,festival_id,slug,is_current,festival:festivals!inner(slug),cover_media:media_assets!editions_cover_media_id_fkey(id,bucket_name,storage_path,file_name,mime_type,size_bytes,width,height,alt_text)",
    )
    .eq("id", editionId)
    .maybeSingle();

  let currentEdition = primaryEdition.data;
  let currentEditionError = primaryEdition.error;

  if (isMissingMediaSchemaError(primaryEdition.error)) {
    const fallbackEdition = await supabase
      .from("editions")
      .select("id,festival_id,slug,is_current,festival:festivals!inner(slug)")
      .eq("id", editionId)
      .maybeSingle();

    currentEdition = fallbackEdition.data
      ? ({ ...fallbackEdition.data, cover_media: null } as unknown as typeof primaryEdition.data)
      : fallbackEdition.data;
    currentEditionError = fallbackEdition.error;
  }

  if (currentEditionError || !currentEdition) {
    redirect(buildEditionUrl(editionId, { error: "No se pudo cargar la edicion para guardarla." }));
  }

  const festivalRelation = Array.isArray(currentEdition.festival)
    ? currentEdition.festival[0]
    : currentEdition.festival;

  const name = normalizeText(formData.get("name"));
  const slug = normalizeSlug(formData.get("slug"));
  const year = normalizeYear(formData.get("year"));
  const startsOn = normalizeText(formData.get("starts_on"));
  const endsOn = normalizeText(formData.get("ends_on"));
  const timezone = normalizeText(formData.get("timezone"));
  const status = normalizeText(formData.get("status"));
  const isCurrent = formData.get("is_current") === "on";
  let previousCurrentEditionId: string | null = null;

  if (!name) {
    redirect(buildEditionUrl(editionId, { error: "El nombre de la edicion es obligatorio.", edit: "edition" }));
  }

  if (!slug) {
    redirect(buildEditionUrl(editionId, { error: "El slug de la edicion es obligatorio.", edit: "edition" }));
  }

  if (!year || year < 2000 || year > 2100) {
    redirect(buildEditionUrl(editionId, { error: "El ano de la edicion no es valido.", edit: "edition" }));
  }

  if (!startsOn || !endsOn) {
    redirect(
      buildEditionUrl(editionId, {
        error: "Las fechas de inicio y fin son obligatorias.",
        edit: "edition",
        field: "dates",
      }),
    );
  }

  if (startsOn && endsOn && hasInvalidEditionRange(startsOn, endsOn)) {
    redirect(
      buildEditionUrl(editionId, {
        error: "La fecha de fin no puede quedar antes de la fecha de inicio.",
        edit: "edition",
        field: "dates",
      }),
    );
  }

  if (!timezone) {
    redirect(buildEditionUrl(editionId, { error: "La zona horaria es obligatoria.", edit: "edition" }));
  }

  if (!status || !EDITION_STATUS_VALUES.has(status)) {
    redirect(buildEditionUrl(editionId, { error: "El estado de la edicion no es valido.", edit: "edition" }));
  }

  const mediaChange = await saveEntityCoverMedia({
    ownerType: "edition",
    ownerId: editionId,
    currentAsset: resolveMediaAsset(currentEdition.cover_media),
    fileEntry: formData.get("cover_image"),
    altTextEntry: formData.get("cover_image_alt_text"),
    widthEntry: formData.get("cover_image_width"),
    heightEntry: formData.get("cover_image_height"),
    removeEntry: formData.get("remove_cover_image"),
  });

  if (mediaChange.error) {
    redirect(buildEditionUrl(editionId, { error: mediaChange.error, edit: "edition" }));
  }

  if (isCurrent) {
    const { data: previousCurrentEdition } = await supabase
      .from("editions")
      .select("id")
      .eq("festival_id", currentEdition.festival_id)
      .eq("is_current", true)
      .maybeSingle();

    previousCurrentEditionId = previousCurrentEdition?.id ?? null;
    await supabase
      .from("editions")
      .update({ is_current: false })
      .eq("festival_id", currentEdition.festival_id)
      .neq("id", editionId);
  }

  const { error: updateError } = await supabase
    .from("editions")
    .update({
      name,
      slug,
      year,
      starts_on: startsOn,
      ends_on: endsOn,
      timezone,
      status,
      is_current: isCurrent,
      ...(mediaChange.coverMediaId !== undefined ? { cover_media_id: mediaChange.coverMediaId } : {}),
    })
    .eq("id", editionId);

  if (updateError) {
    if (mediaChange.cleanupOnFailureMediaId) {
      await deleteMediaAsset(mediaChange.cleanupOnFailureMediaId);
    }

    if (isCurrent && previousCurrentEditionId && previousCurrentEditionId !== editionId) {
      await supabase.from("editions").update({ is_current: true }).eq("id", previousCurrentEditionId);
    }

    const message =
      updateError.code === "23505"
        ? "Ya existe otra edicion con ese slug dentro del festival."
        : updateError.code === "23514"
          ? "La fecha de fin no puede quedar antes de la fecha de inicio."
        : updateError.message;

    redirect(
      buildEditionUrl(editionId, {
        error: message,
        edit: "edition",
        ...(updateError.code === "23514" ? { field: "dates" } : {}),
      }),
    );
  }

  if (mediaChange.cleanupOnSuccessMediaId) {
    await deleteMediaAsset(mediaChange.cleanupOnSuccessMediaId);
  }

  revalidatePath("/cms");
  revalidatePath("/cms/festivales");
  revalidatePath("/cms/ediciones");
  revalidatePath(`/cms/festivales/${currentEdition.festival_id}`);
  revalidatePath(buildEditionUrl(editionId));
  revalidatePath(`${buildEditionUrl(editionId)}/actos`);
  revalidatePath("/");

  if (festivalRelation?.slug) {
    const oldPublicBasePath = `/${festivalRelation.slug}/${currentEdition.slug}`;
    const nextPublicBasePath = `/${festivalRelation.slug}/${slug}`;

    revalidatePath(oldPublicBasePath);
    revalidatePath(`${oldPublicBasePath}/agenda`);
    revalidatePath(nextPublicBasePath);
    revalidatePath(`${nextPublicBasePath}/agenda`);
  }

  redirect(buildEditionUrl(editionId, { saved: "1" }));
}
