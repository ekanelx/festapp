"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireCmsSession } from "@/lib/cms/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const EVENT_STATUS_VALUES = new Set(["scheduled", "updated", "cancelled", "finished"]);
const REVIEW_STATUS_VALUES = new Set(["draft", "in_review", "ready", "published"]);

function buildEditorUrl(eventId: string, params?: Record<string, string>) {
  const query = new URLSearchParams(params);
  const suffix = query.toString();

  return suffix ? `/cms/actos/${eventId}?${suffix}` : `/cms/actos/${eventId}`;
}

function buildCreateUrl(editionId: string, params?: Record<string, string>) {
  const query = new URLSearchParams(params);
  const suffix = query.toString();

  return suffix ? `/cms/ediciones/${editionId}/actos/nuevo?${suffix}` : `/cms/ediciones/${editionId}/actos/nuevo`;
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

function getTimeZoneOffsetMinutes(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "shortOffset",
    hour: "2-digit",
  });
  const timeZoneName = formatter.formatToParts(date).find((part) => part.type === "timeZoneName")?.value;

  if (!timeZoneName) {
    return 0;
  }

  const normalized = timeZoneName.replace("GMT", "");

  if (!normalized || normalized === "0") {
    return 0;
  }

  const match = normalized.match(/^([+-])(\d{1,2})(?::?(\d{2}))?$/);

  if (!match) {
    return 0;
  }

  const [, sign, hours, minutes] = match;
  const total = Number(hours) * 60 + Number(minutes ?? "0");

  return sign === "-" ? -total : total;
}

function zonedDateTimeToIso(localDateTime: string, timeZone: string) {
  const match = localDateTime.match(
    /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})T(?<hour>\d{2}):(?<minute>\d{2})$/,
  );

  if (!match?.groups) {
    return null;
  }

  const year = Number(match.groups.year);
  const month = Number(match.groups.month);
  const day = Number(match.groups.day);
  const hour = Number(match.groups.hour);
  const minute = Number(match.groups.minute);
  const baseUtc = Date.UTC(year, month - 1, day, hour, minute);

  let actualUtc = baseUtc;

  for (let index = 0; index < 2; index += 1) {
    const offset = getTimeZoneOffsetMinutes(new Date(actualUtc), timeZone);
    actualUtc = baseUtc - offset * 60_000;
  }

  return new Date(actualUtc).toISOString();
}

export async function createCmsEventAction(formData: FormData) {
  await requireCmsSession();

  const editionId = normalizeText(formData.get("edition_id"));

  if (!editionId) {
    redirect("/cms/ediciones");
  }

  const supabase = await createSupabaseServerClient();
  const { data: edition, error: editionError } = await supabase
    .from("editions")
    .select("id,slug,timezone,festival_id,festival:festivals!inner(id,slug)")
    .eq("id", editionId)
    .maybeSingle();

  if (editionError || !edition) {
    redirect(buildCreateUrl(editionId, { error: "No se pudo cargar la edicion para crear el acto." }));
  }

  const festivalRelation = Array.isArray(edition.festival) ? edition.festival[0] : edition.festival;
  const title = normalizeText(formData.get("title"));
  const slug = normalizeSlug(formData.get("slug")) ?? normalizeSlug(formData.get("title"));
  const startsAtInput = normalizeText(formData.get("starts_at"));
  const status = normalizeText(formData.get("status"));
  const reviewStatus = normalizeText(formData.get("review_status"));
  const shortDescription = normalizeText(formData.get("short_description"));
  const changeNote = normalizeText(formData.get("change_note"));
  const locationPending = formData.get("location_pending") === "on";
  const locationId = normalizeText(formData.get("location_id"));

  if (!title) {
    redirect(buildCreateUrl(editionId, { error: "El titulo del acto es obligatorio." }));
  }

  if (!slug) {
    redirect(buildCreateUrl(editionId, { error: "El slug del acto es obligatorio." }));
  }

  if (!startsAtInput) {
    redirect(buildCreateUrl(editionId, { error: "La fecha y hora del acto son obligatorias." }));
  }

  if (!status || !EVENT_STATUS_VALUES.has(status)) {
    redirect(buildCreateUrl(editionId, { error: "El estado del acto no es valido." }));
  }

  if (!reviewStatus || !REVIEW_STATUS_VALUES.has(reviewStatus)) {
    redirect(buildCreateUrl(editionId, { error: "La publicacion del acto no es valida." }));
  }

  if (!locationPending && !locationId) {
    redirect(buildCreateUrl(editionId, { error: "Elige una ubicacion o marca la ubicacion como pendiente." }));
  }

  const startsAtIso = zonedDateTimeToIso(startsAtInput, edition.timezone ?? "Europe/Madrid");

  if (!startsAtIso) {
    redirect(buildCreateUrl(editionId, { error: "No se ha podido interpretar la fecha y hora." }));
  }

  const { data: createdEvent, error: createError } = await supabase
    .from("events")
    .insert({
      edition_id: editionId,
      title,
      slug,
      starts_at: startsAtIso,
      status,
      review_status: reviewStatus,
      short_description: shortDescription,
      change_note: changeNote,
      location_id: locationPending ? null : locationId,
      location_pending: locationPending,
      published_at: reviewStatus === "published" ? new Date().toISOString() : null,
    })
    .select("id")
    .maybeSingle();

  if (createError || !createdEvent) {
    const message =
      createError?.code === "23505"
        ? "Ya existe otro acto con ese slug dentro de la misma edicion."
        : createError?.message ?? "No se pudo crear el acto.";

    redirect(buildCreateUrl(editionId, { error: message }));
  }

  revalidatePath("/cms");
  revalidatePath("/cms/festivales");
  revalidatePath("/cms/ediciones");
  revalidatePath(`/cms/festivales/${edition.festival_id}`);
  revalidatePath(`/cms/ediciones/${editionId}`);
  revalidatePath(`/cms/ediciones/${editionId}/actos`);
  revalidatePath("/");

  if (festivalRelation?.slug && edition.slug) {
    const editionBasePath = `/${festivalRelation.slug}/${edition.slug}`;

    revalidatePath(editionBasePath);
    revalidatePath(`${editionBasePath}/agenda`);
    revalidatePath(`${editionBasePath}/actos/${slug}`);
  }

  redirect(buildEditorUrl(createdEvent.id, { created: "1" }));
}

export async function updateCmsEventAction(formData: FormData) {
  await requireCmsSession();

  const eventId = normalizeText(formData.get("event_id"));

  if (!eventId) {
    redirect("/cms/actos");
  }

  const supabase = await createSupabaseServerClient();
  const { data: currentEvent, error: currentEventError } = await supabase
    .from("events")
    .select("id,slug,published_at,edition:editions!inner(id,slug,timezone,festival:festivals!inner(id,slug))")
    .eq("id", eventId)
    .maybeSingle();

  if (currentEventError || !currentEvent) {
    redirect(buildEditorUrl(eventId, { error: "No se pudo cargar el acto para guardarlo." }));
  }

  const editionRelation = Array.isArray(currentEvent.edition)
    ? currentEvent.edition[0]
    : currentEvent.edition;
  const festivalRelation = Array.isArray(editionRelation?.festival)
    ? editionRelation?.festival[0]
    : editionRelation?.festival;

  const title = normalizeText(formData.get("title"));
  const slug = normalizeSlug(formData.get("slug"));
  const startsAtInput = normalizeText(formData.get("starts_at"));
  const status = normalizeText(formData.get("status"));
  const reviewStatus = normalizeText(formData.get("review_status"));
  const shortDescription = normalizeText(formData.get("short_description"));
  const changeNote = normalizeText(formData.get("change_note"));
  const locationPending = formData.get("location_pending") === "on";
  const locationId = normalizeText(formData.get("location_id"));

  if (!title) {
    redirect(buildEditorUrl(eventId, { error: "El titulo es obligatorio." }));
  }

  if (!slug) {
    redirect(buildEditorUrl(eventId, { error: "El slug es obligatorio y debe ser valido." }));
  }

  if (!startsAtInput) {
    redirect(buildEditorUrl(eventId, { error: "La fecha y hora son obligatorias." }));
  }

  if (!status || !EVENT_STATUS_VALUES.has(status)) {
    redirect(buildEditorUrl(eventId, { error: "El estado indicado no es valido." }));
  }

  if (!reviewStatus || !REVIEW_STATUS_VALUES.has(reviewStatus)) {
    redirect(buildEditorUrl(eventId, { error: "La publicacion indicada no es valida." }));
  }

  if (!locationPending && !locationId) {
    redirect(buildEditorUrl(eventId, { error: "Elige una ubicacion o marca la ubicacion como pendiente." }));
  }

  const startsAtIso = zonedDateTimeToIso(startsAtInput, editionRelation?.timezone ?? "Europe/Madrid");

  if (!startsAtIso) {
    redirect(buildEditorUrl(eventId, { error: "No se ha podido interpretar la fecha y hora." }));
  }

  const nextPublishedAt =
    reviewStatus === "published" ? currentEvent.published_at ?? new Date().toISOString() : null;

  const { error: updateError } = await supabase
    .from("events")
    .update({
      title,
      slug,
      starts_at: startsAtIso,
      status,
      review_status: reviewStatus,
      short_description: shortDescription,
      change_note: changeNote,
      location_id: locationPending ? null : locationId,
      location_pending: locationPending,
      published_at: nextPublishedAt,
    })
    .eq("id", eventId);

  if (updateError) {
    const message =
      updateError.code === "23505"
        ? "Ya existe otro acto con ese slug dentro de la misma edicion."
        : updateError.message;

    redirect(buildEditorUrl(eventId, { error: message }));
  }

  revalidatePath("/cms");
  revalidatePath("/cms/actos");
  revalidatePath("/cms/festivales");
  revalidatePath("/cms/ediciones");
  revalidatePath(buildEditorUrl(eventId));
  revalidatePath("/");

  if (festivalRelation?.slug && editionRelation?.slug) {
    if (festivalRelation.id) {
      revalidatePath(`/cms/festivales/${festivalRelation.id}`);
    }

    if (editionRelation.id) {
      revalidatePath(`/cms/ediciones/${editionRelation.id}`);
      revalidatePath(`/cms/ediciones/${editionRelation.id}/actos`);
    }

    const editionBasePath = `/${festivalRelation.slug}/${editionRelation.slug}`;

    revalidatePath(editionBasePath);
    revalidatePath(`${editionBasePath}/agenda`);
    revalidatePath(`${editionBasePath}/actos/${currentEvent.slug}`);
    revalidatePath(`${editionBasePath}/actos/${slug}`);
  }

  redirect(buildEditorUrl(eventId, { saved: "1" }));
}
