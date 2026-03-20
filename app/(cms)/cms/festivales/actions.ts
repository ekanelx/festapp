"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireCmsRole } from "@/lib/cms/auth";
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
  const { data: currentFestival, error: currentFestivalError } = await supabase
    .from("festivals")
    .select("id,slug")
    .eq("id", festivalId)
    .maybeSingle();

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

  const { error: updateError } = await supabase
    .from("festivals")
    .update({
      name,
      city,
      default_timezone: defaultTimezone,
      short_description: shortDescription,
      status,
    })
    .eq("id", festivalId);

  if (updateError) {
    redirect(buildFestivalUrl(festivalId, { error: updateError.message, edit: "festival" }));
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
  const { data: festival, error: festivalError } = await supabase
    .from("festivals")
    .select("id,slug,default_timezone")
    .eq("id", festivalId)
    .maybeSingle();

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
