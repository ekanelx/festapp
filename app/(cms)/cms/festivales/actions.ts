"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireCmsRole } from "@/lib/cms/auth";
import { deleteMediaAsset, saveEntityCoverMedia } from "@/lib/media/server";
import { isMissingMediaSchemaError, resolveMediaAsset } from "@/lib/media/utils";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const FESTIVAL_STATUS_VALUES = new Set(["draft", "published", "archived"]);
const EDITION_STATUS_VALUES = new Set(["draft", "published", "archived"]);

function buildFestivalUrl(festivalId: string, params?: Record<string, string>) {
  const query = new URLSearchParams(params);
  const suffix = query.toString();

  return suffix ? `/cms/festivales/${festivalId}?${suffix}` : `/cms/festivales/${festivalId}`;
}

function buildNewEditionUrl(festivalId: string, params?: Record<string, string>) {
  const query = new URLSearchParams(params);
  const suffix = query.toString();

  return suffix
    ? `/cms/festivales/${festivalId}/ediciones/nueva?${suffix}`
    : `/cms/festivales/${festivalId}/ediciones/nueva`;
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

async function revalidateFestivalPaths({
  festivalId,
  festivalSlug,
  editions,
}: {
  festivalId: string;
  festivalSlug: string;
  editions: { id: string; slug: string }[];
}) {
  revalidatePath("/cms");
  revalidatePath("/cms/festivales");
  revalidatePath("/cms/ediciones");
  revalidatePath(`/cms/festivales/${festivalId}`);
  revalidatePath("/");

  for (const edition of editions) {
    revalidatePath(`/cms/ediciones/${edition.id}`);
    revalidatePath(`/cms/ediciones/${edition.id}/actos`);

    const publicBasePath = `/${festivalSlug}/${edition.slug}`;
    revalidatePath(publicBasePath);
    revalidatePath(`${publicBasePath}/agenda`);
  }
}

export async function updateFestivalAction(formData: FormData) {
  await requireCmsRole("admin");

  const festivalId = normalizeText(formData.get("festival_id"));

  if (!festivalId) {
    redirect("/cms/festivales");
  }

  const supabase = await createSupabaseServerClient();
  const primaryFestival = await supabase
    .from("festivals")
    .select(
      "id,slug,cover_media:media_assets!festivals_cover_media_id_fkey(id,bucket_name,storage_path,file_name,mime_type,size_bytes,width,height,alt_text)",
    )
    .eq("id", festivalId)
    .maybeSingle();

  let currentFestival = primaryFestival.data;
  let currentFestivalError = primaryFestival.error;

  if (isMissingMediaSchemaError(primaryFestival.error)) {
    const fallbackFestival = await supabase
      .from("festivals")
      .select("id,slug")
      .eq("id", festivalId)
      .maybeSingle();

    currentFestival = fallbackFestival.data
      ? ({ ...fallbackFestival.data, cover_media: null } as unknown as typeof primaryFestival.data)
      : fallbackFestival.data;
    currentFestivalError = fallbackFestival.error;
  }

  if (currentFestivalError || !currentFestival) {
    redirect(buildFestivalUrl(festivalId, { error: "No se pudo cargar el festival para guardarlo." }));
  }

  const name = normalizeText(formData.get("name"));
  const city = normalizeText(formData.get("city"));
  const defaultTimezone = normalizeText(formData.get("default_timezone"));
  const shortDescription = normalizeText(formData.get("short_description"));
  const status = normalizeText(formData.get("status"));

  if (!name) {
    redirect(buildFestivalUrl(festivalId, { error: "El nombre del festival es obligatorio.", edit: "festival" }));
  }

  if (!defaultTimezone) {
    redirect(
      buildFestivalUrl(festivalId, {
        error: "La zona horaria por defecto es obligatoria.",
        edit: "festival",
      }),
    );
  }

  if (!status || !FESTIVAL_STATUS_VALUES.has(status)) {
    redirect(buildFestivalUrl(festivalId, { error: "El estado indicado no es valido.", edit: "festival" }));
  }

  const mediaChange = await saveEntityCoverMedia({
    ownerType: "festival",
    ownerId: festivalId,
    currentAsset: resolveMediaAsset(currentFestival.cover_media),
    fileEntry: formData.get("cover_image"),
    altTextEntry: formData.get("cover_image_alt_text"),
    widthEntry: formData.get("cover_image_width"),
    heightEntry: formData.get("cover_image_height"),
    removeEntry: formData.get("remove_cover_image"),
  });

  if (mediaChange.error) {
    redirect(buildFestivalUrl(festivalId, { error: mediaChange.error, edit: "festival" }));
  }

  const { error: updateError } = await supabase
    .from("festivals")
    .update({
      name,
      city,
      default_timezone: defaultTimezone,
      short_description: shortDescription,
      status,
      ...(mediaChange.coverMediaId !== undefined ? { cover_media_id: mediaChange.coverMediaId } : {}),
    })
    .eq("id", festivalId);

  if (updateError) {
    if (mediaChange.cleanupOnFailureMediaId) {
      await deleteMediaAsset(mediaChange.cleanupOnFailureMediaId);
    }

    redirect(buildFestivalUrl(festivalId, { error: updateError.message, edit: "festival" }));
  }

  if (mediaChange.cleanupOnSuccessMediaId) {
    await deleteMediaAsset(mediaChange.cleanupOnSuccessMediaId);
  }

  const { data: editions } = await supabase
    .from("editions")
    .select("id,slug")
    .eq("festival_id", festivalId);

  await revalidateFestivalPaths({
    festivalId,
    festivalSlug: currentFestival.slug,
    editions: editions ?? [],
  });

  redirect(buildFestivalUrl(festivalId, { saved: "1" }));
}

export async function createFestivalAction(formData: FormData) {
  await requireCmsRole("admin");

  const supabase = await createSupabaseServerClient();
  const name = normalizeText(formData.get("name"));
  const slug = normalizeSlug(formData.get("slug"));
  const city = normalizeText(formData.get("city"));
  const defaultTimezone = normalizeText(formData.get("default_timezone"));
  const shortDescription = normalizeText(formData.get("short_description"));
  const status = normalizeText(formData.get("status"));

  if (!name) {
    redirect(`/cms/festivales/nuevo?error=${encodeURIComponent("El nombre del festival es obligatorio.")}`);
  }

  if (!slug) {
    redirect(`/cms/festivales/nuevo?error=${encodeURIComponent("El slug del festival es obligatorio.")}`);
  }

  if (!defaultTimezone) {
    redirect(
      `/cms/festivales/nuevo?error=${encodeURIComponent("La zona horaria por defecto es obligatoria.")}`,
    );
  }

  if (!status || !FESTIVAL_STATUS_VALUES.has(status)) {
    redirect(`/cms/festivales/nuevo?error=${encodeURIComponent("El estado indicado no es valido.")}`);
  }

  const { data: createdFestival, error: createError } = await supabase
    .from("festivals")
    .insert({
      name,
      slug,
      city,
      default_timezone: defaultTimezone,
      short_description: shortDescription,
      status,
    })
    .select("id,slug")
    .maybeSingle();

  if (createError || !createdFestival) {
    const message =
      createError?.code === "23505"
        ? "Ya existe otro festival con ese slug."
        : createError?.message ?? "No se pudo crear el festival.";

    redirect(`/cms/festivales/nuevo?error=${encodeURIComponent(message)}`);
  }

  const mediaChange = await saveEntityCoverMedia({
    ownerType: "festival",
    ownerId: createdFestival.id,
    currentAsset: null,
    fileEntry: formData.get("cover_image"),
    altTextEntry: formData.get("cover_image_alt_text"),
    widthEntry: formData.get("cover_image_width"),
    heightEntry: formData.get("cover_image_height"),
    removeEntry: formData.get("remove_cover_image"),
  });

  if (mediaChange.error) {
    await revalidateFestivalPaths({
      festivalId: createdFestival.id,
      festivalSlug: createdFestival.slug,
      editions: [],
    });

    redirect(buildFestivalUrl(createdFestival.id, { created: "1", error: mediaChange.error, edit: "festival" }));
  }

  if (mediaChange.coverMediaId !== undefined) {
    const { error: coverUpdateError } = await supabase
      .from("festivals")
      .update({ cover_media_id: mediaChange.coverMediaId })
      .eq("id", createdFestival.id);

    if (coverUpdateError) {
      if (mediaChange.cleanupOnFailureMediaId) {
        await deleteMediaAsset(mediaChange.cleanupOnFailureMediaId);
      }

      redirect(
        buildFestivalUrl(createdFestival.id, {
          created: "1",
          error: "El festival se ha creado, pero no se ha podido guardar su portada.",
          edit: "festival",
        }),
      );
    }
  }

  await revalidateFestivalPaths({
    festivalId: createdFestival.id,
    festivalSlug: createdFestival.slug,
    editions: [],
  });

  redirect(`/cms/festivales/${createdFestival.id}?created=1`);
}

export async function createEditionAction(formData: FormData) {
  await requireCmsRole("admin");

  const festivalId = normalizeText(formData.get("festival_id"));

  if (!festivalId) {
    redirect("/cms/festivales");
  }

  const supabase = await createSupabaseServerClient();
  const primaryFestival = await supabase
    .from("festivals")
    .select(
      "id,slug,default_timezone,cover_media:media_assets!festivals_cover_media_id_fkey(id,bucket_name,storage_path,file_name,mime_type,size_bytes,width,height,alt_text)",
    )
    .eq("id", festivalId)
    .maybeSingle();

  let festival = primaryFestival.data;
  let festivalError = primaryFestival.error;

  if (isMissingMediaSchemaError(primaryFestival.error)) {
    const fallbackFestival = await supabase
      .from("festivals")
      .select("id,slug,default_timezone")
      .eq("id", festivalId)
      .maybeSingle();

    festival = fallbackFestival.data
      ? ({ ...fallbackFestival.data, cover_media: null } as unknown as typeof primaryFestival.data)
      : fallbackFestival.data;
    festivalError = fallbackFestival.error;
  }

  if (festivalError || !festival) {
    redirect(buildNewEditionUrl(festivalId, { error: "No se pudo cargar el festival para crear la edicion." }));
  }

  const name = normalizeText(formData.get("name"));
  const slug = normalizeSlug(formData.get("slug"));
  const year = normalizeYear(formData.get("year"));
  const startsOn = normalizeText(formData.get("starts_on"));
  const endsOn = normalizeText(formData.get("ends_on"));
  const timezone = normalizeText(formData.get("timezone")) ?? festival.default_timezone;
  const status = normalizeText(formData.get("status"));
  const isCurrent = formData.get("is_current") === "on";
  let previousCurrentEditionId: string | null = null;

  if (!name) {
    redirect(buildNewEditionUrl(festivalId, { error: "El nombre de la edicion es obligatorio." }));
  }

  if (!slug) {
    redirect(buildNewEditionUrl(festivalId, { error: "El slug de la edicion es obligatorio." }));
  }

  if (!year || year < 2000 || year > 2100) {
    redirect(buildNewEditionUrl(festivalId, { error: "El ano de la edicion no es valido." }));
  }

  if (!startsOn || !endsOn) {
    redirect(
      buildNewEditionUrl(festivalId, {
        error: "Las fechas de inicio y fin son obligatorias.",
        field: "dates",
      }),
    );
  }

  if (startsOn && endsOn && hasInvalidEditionRange(startsOn, endsOn)) {
    redirect(
      buildNewEditionUrl(festivalId, {
        error: "La fecha de fin no puede quedar antes de la fecha de inicio.",
        field: "dates",
      }),
    );
  }

  if (!status || !EDITION_STATUS_VALUES.has(status)) {
    redirect(buildNewEditionUrl(festivalId, { error: "El estado de la edicion no es valido." }));
  }

  if (isCurrent) {
    const { data: currentEdition } = await supabase
      .from("editions")
      .select("id")
      .eq("festival_id", festivalId)
      .eq("is_current", true)
      .maybeSingle();

    previousCurrentEditionId = currentEdition?.id ?? null;
    await supabase.from("editions").update({ is_current: false }).eq("festival_id", festivalId);
  }

  const { data: createdEdition, error: createError } = await supabase
    .from("editions")
    .insert({
      festival_id: festivalId,
      name,
      slug,
      year,
      starts_on: startsOn,
      ends_on: endsOn,
      timezone,
      status,
      is_current: isCurrent,
    })
    .select("id,slug")
    .maybeSingle();

  if (createError || !createdEdition) {
    if (isCurrent && previousCurrentEditionId) {
      await supabase.from("editions").update({ is_current: true }).eq("id", previousCurrentEditionId);
    }

    const message =
      createError?.code === "23505"
        ? "Ya existe otra edicion con ese slug dentro del festival."
        : createError?.code === "23514"
          ? "La fecha de fin no puede quedar antes de la fecha de inicio."
        : createError?.message ?? "No se pudo crear la edicion.";

    redirect(
      buildNewEditionUrl(festivalId, {
        error: message,
        ...(createError?.code === "23514" ? { field: "dates" } : {}),
      }),
    );
  }

  const mediaChange = await saveEntityCoverMedia({
    ownerType: "edition",
    ownerId: createdEdition.id,
    currentAsset: null,
    fileEntry: formData.get("cover_image"),
    altTextEntry: formData.get("cover_image_alt_text"),
    widthEntry: formData.get("cover_image_width"),
    heightEntry: formData.get("cover_image_height"),
    removeEntry: formData.get("remove_cover_image"),
  });

  if (mediaChange.error) {
    await revalidateFestivalPaths({
      festivalId,
      festivalSlug: festival.slug,
      editions: [{ id: createdEdition.id, slug: createdEdition.slug }],
    });

    revalidatePath(`/cms/ediciones/${createdEdition.id}`);
    revalidatePath(`/cms/ediciones/${createdEdition.id}/actos`);

    redirect(
      buildEditionUrlForCreation(createdEdition.id, {
        created: "1",
        error: mediaChange.error,
        edit: "edition",
      }),
    );
  }

  if (mediaChange.coverMediaId !== undefined) {
    const { error: coverUpdateError } = await supabase
      .from("editions")
      .update({ cover_media_id: mediaChange.coverMediaId })
      .eq("id", createdEdition.id);

    if (coverUpdateError) {
      if (mediaChange.cleanupOnFailureMediaId) {
        await deleteMediaAsset(mediaChange.cleanupOnFailureMediaId);
      }

      redirect(
        buildEditionUrlForCreation(createdEdition.id, {
          created: "1",
          error: "La edicion se ha creado, pero no se ha podido guardar su portada.",
          edit: "edition",
        }),
      );
    }
  }

  const { data: editions } = await supabase
    .from("editions")
    .select("id,slug")
    .eq("festival_id", festivalId);

  await revalidateFestivalPaths({
    festivalId,
    festivalSlug: festival.slug,
    editions: editions ?? [],
  });

  revalidatePath(`/cms/ediciones/${createdEdition.id}`);
  revalidatePath(`/cms/ediciones/${createdEdition.id}/actos`);

  redirect(`/cms/ediciones/${createdEdition.id}?created=1`);
}

function buildEditionUrlForCreation(editionId: string, params?: Record<string, string>) {
  const query = new URLSearchParams(params);
  const suffix = query.toString();

  return suffix ? `/cms/ediciones/${editionId}?${suffix}` : `/cms/ediciones/${editionId}`;
}
