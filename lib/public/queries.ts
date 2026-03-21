import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { EventStatus } from "@/lib/domain/types";
import {
  isMissingMediaSchemaError,
  resolveMediaAsset,
  type MediaAsset,
  type RawMediaAssetRelation,
} from "@/lib/media/utils";

type PublicFestivalRow = {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  coverMedia: MediaAsset | null;
};

type RawPublicFestivalRow = Omit<PublicFestivalRow, "coverMedia"> & {
  cover_media: RawMediaAssetRelation;
};

type PublicEditionRow = {
  id: string;
  name: string;
  slug: string;
  year: number;
  starts_on: string;
  ends_on: string;
  timezone: string;
  coverMedia: MediaAsset | null;
};

type RawPublicEditionRow = Omit<PublicEditionRow, "coverMedia"> & {
  cover_media: RawMediaAssetRelation;
};

type RawLocationRecord = {
  name: string;
  address?: string | null;
  google_maps_url?: string | null;
};

type RawLocationRelation = RawLocationRecord | RawLocationRecord[] | null;

type PublicEventRow = {
  id: string;
  title: string;
  slug: string;
  starts_at: string;
  status: EventStatus;
  change_note?: string | null;
  location_pending: boolean;
  location: RawLocationRelation;
  cover_media: RawMediaAssetRelation;
};

type PublicEventDetailRow = {
  title: string;
  slug: string;
  short_description: string | null;
  starts_at: string;
  status: EventStatus;
  location_pending: boolean;
  change_note: string | null;
  location: RawLocationRelation;
  cover_media: RawMediaAssetRelation;
};

export type PublicEditionRoute = {
  festivalSlug: string;
  editionSlug: string;
};

export type PublicEventSummary = {
  id: string;
  slug: string;
  title: string;
  status: EventStatus;
  startsAtIso: string;
  startsAtLabel: string;
  startsAtTimeLabel: string;
  startsAtDayLabel: string;
  locationLabel: string | null;
  statusLabel: string | null;
  changeNote: string | null;
  coverMedia: MediaAsset | null;
};

export type PublicEditionPageData = {
  festivalName: string;
  festivalSlug: string;
  festivalCity: string | null;
  editionName: string;
  editionSlug: string;
  year: number;
  dateRangeLabel: string;
  temporalLabel: string | null;
  coverMedia: MediaAsset | null;
  todayEvents: PublicEventSummary[];
  upcomingEvents: PublicEventSummary[];
  allEvents: PublicEventSummary[];
  changedEvents: PublicEventSummary[];
};

export type PublicHomeEditionItem = {
  festivalName: string;
  festivalSlug: string;
  festivalCity: string | null;
  editionName: string;
  editionSlug: string;
  year: number;
  dateRangeLabel: string;
  temporalLabel: string;
  publishedEventsCount: number;
  festivalCoverMedia: MediaAsset | null;
};

export type PublicEventDetailData = {
  festivalName: string;
  festivalSlug: string;
  festivalCity: string | null;
  editionName: string;
  editionSlug: string;
  editionDateRangeLabel: string;
  title: string;
  status: EventStatus;
  startsAtIso: string;
  startsAtDateLabel: string;
  startsAtDayLabel: string;
  startsAtTimeLabel: string;
  locationName: string | null;
  locationAddress: string | null;
  locationStatusLabel: string;
  mapsUrl: string | null;
  statusLabel: string | null;
  statusNote: string | null;
  shortDescription: string | null;
  coverMedia: MediaAsset | null;
};

type QueryState<T> = {
  data: T | null;
  error: string | null;
};

function formatDayKey(value: string, timeZone: string) {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

function formatEventDate(value: string, timeZone: string) {
  return new Intl.DateTimeFormat("es-ES", {
    timeZone,
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatEventLongDate(value: string, timeZone: string) {
  return new Intl.DateTimeFormat("es-ES", {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(value));
}

function formatEventTime(value: string, timeZone: string) {
  return new Intl.DateTimeFormat("es-ES", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatEventDay(value: string, timeZone: string) {
  return new Intl.DateTimeFormat("es-ES", {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

function formatEditionDateRange(startsOn: string, endsOn: string, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("es-ES", {
    timeZone,
    day: "numeric",
    month: "short",
  });

  return `${formatter.format(new Date(startsOn))} - ${formatter.format(new Date(endsOn))}`;
}

function formatDateKeyForTimeZone(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function extractLocation(location: RawLocationRelation) {
  if (!location) {
    return null;
  }

  if (Array.isArray(location)) {
    return location[0] ?? null;
  }

  return location;
}

function buildMapsUrl(location: RawLocationRecord | null) {
  if (!location) {
    return null;
  }

  if (location.google_maps_url) {
    return location.google_maps_url;
  }

  if (!location.address) {
    return null;
  }

  const query = [location.name, location.address].filter(Boolean).join(", ");

  if (!query) {
    return null;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function getUserStatusLabel(status: EventStatus) {
  if (status === "updated") {
    return "Actualizado";
  }

  if (status === "cancelled") {
    return "Cancelado";
  }

  if (status === "finished") {
    return "Finalizado";
  }

  return null;
}

function getUserStatusNote(status: EventStatus, changeNote: string | null) {
  if (changeNote) {
    return changeNote;
  }

  if (status === "updated") {
    return "Este acto ha cambiado respecto a la programacion inicial.";
  }

  if (status === "cancelled") {
    return "Este acto ya no se celebra en el horario previsto.";
  }

  if (status === "finished") {
    return "Este acto ya ha finalizado dentro de esta edicion.";
  }

  return null;
}

function mapEvent(row: PublicEventRow, timeZone: string): PublicEventSummary {
  const locationName = extractLocation(row.location)?.name ?? null;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    status: row.status,
    startsAtIso: row.starts_at,
    startsAtLabel: formatEventDate(row.starts_at, timeZone),
    startsAtTimeLabel: formatEventTime(row.starts_at, timeZone),
    startsAtDayLabel: formatEventDay(row.starts_at, timeZone),
    locationLabel: locationName ?? (row.location_pending ? "Ubicacion por confirmar" : null),
    statusLabel: getUserStatusLabel(row.status),
    changeNote: null,
    coverMedia: resolveMediaAsset(row.cover_media),
  };
}

function mapEventDetail(
  row: PublicEventDetailRow,
  edition: PublicEditionRow,
  festival: PublicFestivalRow,
): PublicEventDetailData {
  const location = extractLocation(row.location);

  return {
    festivalName: festival.name,
    festivalSlug: festival.slug,
    festivalCity: festival.city ?? null,
    editionName: edition.name,
    editionSlug: edition.slug,
    editionDateRangeLabel: formatEditionDateRange(edition.starts_on, edition.ends_on, edition.timezone),
    title: row.title,
    status: row.status,
    startsAtIso: row.starts_at,
    startsAtDateLabel: formatEventLongDate(row.starts_at, edition.timezone),
    startsAtDayLabel: formatEventDay(row.starts_at, edition.timezone),
    startsAtTimeLabel: formatEventTime(row.starts_at, edition.timezone),
    locationName: location?.name ?? null,
    locationAddress: location?.address ?? null,
    locationStatusLabel: row.location_pending
      ? "Ubicacion pendiente de confirmar"
      : "Ubicacion no publicada",
    mapsUrl: buildMapsUrl(location),
    statusLabel: getUserStatusLabel(row.status),
    statusNote: getUserStatusNote(row.status, row.change_note),
    shortDescription: row.short_description,
    coverMedia: resolveMediaAsset(row.cover_media),
  };
}

function mapFestival(row: RawPublicFestivalRow): PublicFestivalRow {
  const { cover_media, ...festival } = row;

  return {
    ...festival,
    coverMedia: resolveMediaAsset(cover_media),
  };
}

function mapEdition(row: RawPublicEditionRow): PublicEditionRow {
  const { cover_media, ...edition } = row;

  return {
    ...edition,
    coverMedia: resolveMediaAsset(cover_media),
  };
}

function splitEventsByTime(events: PublicEventSummary[], timeZone: string) {
  const now = new Date();
  const todayKey = formatDayKey(now.toISOString(), timeZone);

  return {
    todayEvents: events.filter((event) => formatDayKey(event.startsAtIso, timeZone) === todayKey),
    upcomingEvents: events.filter((event) => new Date(event.startsAtIso).getTime() >= now.getTime()),
  };
}

function getChangedEvents(events: PublicEventSummary[]) {
  return events.filter((event) => event.status === "updated" || event.status === "cancelled");
}

function getEditionTemporalLabel(
  startsOn: string,
  endsOn: string,
  timeZone: string,
) {
  const todayKey = formatDateKeyForTimeZone(new Date(), timeZone);

  if (todayKey < startsOn) {
    return "Proximamente";
  }

  if (todayKey === startsOn) {
    return "Hoy";
  }

  if (todayKey <= endsOn) {
    return "En curso";
  }

  return null;
}

async function getFestivalBySlug(festivalSlug: string): Promise<QueryState<PublicFestivalRow>> {
  try {
    const supabase = await createSupabaseServerClient();
    const primary = await supabase
      .from("festivals")
      .select(
        "id,name,slug,city,cover_media:media_assets!festivals_cover_media_id_fkey(id,bucket_name,storage_path,file_name,mime_type,size_bytes,width,height,alt_text)",
      )
      .eq("slug", festivalSlug)
      .maybeSingle();

    let error = primary.error;
    let data: RawPublicFestivalRow | null = primary.data as RawPublicFestivalRow | null;

    if (isMissingMediaSchemaError(primary.error)) {
      const fallback = await supabase
        .from("festivals")
        .select("id,name,slug,city")
        .eq("slug", festivalSlug)
        .maybeSingle();

      data = fallback.data ? ({ ...fallback.data, cover_media: null } as RawPublicFestivalRow) : null;
      error = fallback.error;
    }

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data ? mapFestival(data) : null, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "No se pudo conectar con Supabase.",
    };
  }
}

async function getEditionBySlug(
  festivalId: string,
  editionSlug: string,
): Promise<QueryState<PublicEditionRow>> {
  try {
    const supabase = await createSupabaseServerClient();
    const primary = await supabase
      .from("editions")
      .select(
        "id,name,slug,year,starts_on,ends_on,timezone,cover_media:media_assets!editions_cover_media_id_fkey(id,bucket_name,storage_path,file_name,mime_type,size_bytes,width,height,alt_text)",
      )
      .eq("festival_id", festivalId)
      .eq("slug", editionSlug)
      .maybeSingle();

    let error = primary.error;
    let data: RawPublicEditionRow | null = primary.data as RawPublicEditionRow | null;

    if (isMissingMediaSchemaError(primary.error)) {
      const fallback = await supabase
        .from("editions")
        .select("id,name,slug,year,starts_on,ends_on,timezone")
        .eq("festival_id", festivalId)
        .eq("slug", editionSlug)
        .maybeSingle();

      data = fallback.data ? ({ ...fallback.data, cover_media: null } as RawPublicEditionRow) : null;
      error = fallback.error;
    }

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data ? mapEdition(data) : null, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "No se pudo conectar con Supabase.",
    };
  }
}

export async function getActivePublicEditionRoute(): Promise<QueryState<PublicEditionRoute>> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("editions")
      .select("slug,festival:festivals!inner(slug)")
      .eq("is_current", true)
      .order("starts_on", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      return { data: null, error: error.message };
    }

    const festivalRelation = Array.isArray(data?.festival) ? data?.festival[0] : data?.festival;

    if (!data || !festivalRelation?.slug) {
      return { data: null, error: null };
    }

    return {
      data: {
        festivalSlug: festivalRelation.slug,
        editionSlug: data.slug,
      },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "No se pudo resolver la edicion activa.",
    };
  }
}

export async function getPublicHomeEditionItems(): Promise<QueryState<PublicHomeEditionItem[]>> {
  try {
    const supabase = await createSupabaseServerClient();
    const todayKey = formatDateKeyForTimeZone(new Date(), "Europe/Madrid");
    const primary = await supabase
      .from("editions")
      .select(
        "id,name,slug,year,starts_on,ends_on,timezone,festival:festivals!inner(name,slug,city,cover_media:media_assets!festivals_cover_media_id_fkey(id,bucket_name,storage_path,file_name,mime_type,size_bytes,width,height,alt_text))",
      )
      .gte("ends_on", todayKey)
      .order("starts_on", { ascending: true });

    let error = primary.error;
    let data = primary.data;

    if (isMissingMediaSchemaError(primary.error)) {
      const fallback = await supabase
        .from("editions")
        .select(
          "id,name,slug,year,starts_on,ends_on,timezone,festival:festivals!inner(name,slug,city)",
        )
        .gte("ends_on", todayKey)
        .order("starts_on", { ascending: true });

      data = (fallback.data ?? []).map((row) => {
        const festivalRelation = Array.isArray(row.festival) ? row.festival[0] : row.festival;

        return {
          ...row,
          festival: festivalRelation ? { ...festivalRelation, cover_media: null } : null,
        };
      }) as unknown as typeof primary.data;
      error = fallback.error;
    }

    if (error) {
      return { data: null, error: error.message };
    }

    const editions = (data ?? [])
      .map((row) => {
        const festivalRelation = Array.isArray(row.festival) ? row.festival[0] : row.festival;
        const temporalLabel = getEditionTemporalLabel(
          row.starts_on,
          row.ends_on,
          row.timezone,
        );

        if (!festivalRelation?.slug || !temporalLabel) {
          return null;
        }

        return {
          id: row.id,
          editionName: row.name,
          editionSlug: row.slug,
          year: row.year,
          startsOn: row.starts_on,
          endsOn: row.ends_on,
          timeZone: row.timezone,
          temporalLabel,
          festivalName: festivalRelation.name,
          festivalSlug: festivalRelation.slug,
          festivalCity: festivalRelation.city ?? null,
          festivalCoverMedia: resolveMediaAsset(festivalRelation.cover_media),
        };
      })
      .filter((edition): edition is NonNullable<typeof edition> => edition !== null);

    if (editions.length === 0) {
      return { data: [], error: null };
    }

    const editionIds = editions.map((edition) => edition.id);
    const { data: eventRows, error: eventError } = await supabase
      .from("events")
      .select("edition_id")
      .in("edition_id", editionIds);

    if (eventError) {
      return { data: null, error: eventError.message };
    }

    const eventCounts = new Map<string, number>();

    (eventRows ?? []).forEach((row) => {
      eventCounts.set(row.edition_id, (eventCounts.get(row.edition_id) ?? 0) + 1);
    });

    return {
      data: editions.map((edition) => ({
        festivalName: edition.festivalName,
        festivalSlug: edition.festivalSlug,
        festivalCity: edition.festivalCity,
        editionName: edition.editionName,
        editionSlug: edition.editionSlug,
        year: edition.year,
        dateRangeLabel: formatEditionDateRange(
          edition.startsOn,
          edition.endsOn,
          edition.timeZone,
        ),
        temporalLabel: edition.temporalLabel,
        publishedEventsCount: eventCounts.get(edition.id) ?? 0,
        festivalCoverMedia: edition.festivalCoverMedia,
      })),
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error ? error.message : "No se pudo cargar la home global de Festapp.",
    };
  }
}

export async function getPublicEditionPageData(
  festivalSlug: string,
  editionSlug: string,
): Promise<QueryState<PublicEditionPageData>> {
  const festivalState = await getFestivalBySlug(festivalSlug);

  if (festivalState.error) {
    return { data: null, error: festivalState.error };
  }

  if (!festivalState.data) {
    return { data: null, error: null };
  }

  const editionState = await getEditionBySlug(festivalState.data.id, editionSlug);

  if (editionState.error) {
    return { data: null, error: editionState.error };
  }

  if (!editionState.data) {
    return { data: null, error: null };
  }

  const edition = editionState.data;

  try {
    const supabase = await createSupabaseServerClient();
    const primary = await supabase
      .from("events")
      .select(
        "id,title,slug,starts_at,status,change_note,location_pending,location:locations(name),cover_media:media_assets!events_cover_media_id_fkey(id,bucket_name,storage_path,file_name,mime_type,size_bytes,width,height,alt_text)",
      )
      .eq("edition_id", edition.id)
      .order("starts_at", { ascending: true });

    let error = primary.error;
    let eventRows = primary.data;

    if (isMissingMediaSchemaError(primary.error)) {
      const fallback = await supabase
        .from("events")
        .select("id,title,slug,starts_at,status,change_note,location_pending,location:locations(name)")
        .eq("edition_id", edition.id)
        .order("starts_at", { ascending: true });

      eventRows = (fallback.data ?? []).map((row) => ({ ...row, cover_media: null })) as unknown as typeof primary.data;
      error = fallback.error;
    }

    if (error) {
      return { data: null, error: error.message };
    }

    const allEvents = (eventRows ?? []).map((row) => ({
      ...mapEvent(row, edition.timezone),
      changeNote: row.change_note ?? null,
    }));
    const { todayEvents, upcomingEvents } = splitEventsByTime(allEvents, edition.timezone);
    const changedEvents = getChangedEvents(allEvents);

    return {
      data: {
        festivalName: festivalState.data.name,
        festivalSlug: festivalState.data.slug,
        festivalCity: festivalState.data.city,
        editionName: edition.name,
        editionSlug: edition.slug,
        year: edition.year,
        dateRangeLabel: formatEditionDateRange(
          edition.starts_on,
          edition.ends_on,
          edition.timezone,
        ),
        temporalLabel: getEditionTemporalLabel(edition.starts_on, edition.ends_on, edition.timezone),
        coverMedia: edition.coverMedia,
        todayEvents,
        upcomingEvents,
        allEvents,
        changedEvents,
      },
      error: null,
    };
  } catch (queryError) {
    return {
      data: null,
      error: queryError instanceof Error ? queryError.message : "No se pudo cargar la agenda publica.",
    };
  }
}

export async function getPublicEventDetailData(
  festivalSlug: string,
  editionSlug: string,
  eventSlug: string,
): Promise<QueryState<PublicEventDetailData>> {
  const festivalState = await getFestivalBySlug(festivalSlug);

  if (festivalState.error) {
    return { data: null, error: festivalState.error };
  }

  if (!festivalState.data) {
    return { data: null, error: null };
  }

  const editionState = await getEditionBySlug(festivalState.data.id, editionSlug);

  if (editionState.error) {
    return { data: null, error: editionState.error };
  }

  if (!editionState.data) {
    return { data: null, error: null };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const primary = await supabase
      .from("events")
      .select(
        "title,slug,short_description,starts_at,status,location_pending,change_note,location:locations(name,address,google_maps_url),cover_media:media_assets!events_cover_media_id_fkey(id,bucket_name,storage_path,file_name,mime_type,size_bytes,width,height,alt_text)",
      )
      .eq("edition_id", editionState.data.id)
      .eq("slug", eventSlug)
      .maybeSingle();

    let error = primary.error;
    let data: PublicEventDetailRow | null = primary.data as PublicEventDetailRow | null;

    if (isMissingMediaSchemaError(primary.error)) {
      const fallback = await supabase
        .from("events")
        .select(
          "title,slug,short_description,starts_at,status,location_pending,change_note,location:locations(name,address,google_maps_url)",
        )
        .eq("edition_id", editionState.data.id)
        .eq("slug", eventSlug)
        .maybeSingle();

      data = fallback.data ? ({ ...fallback.data, cover_media: null } as PublicEventDetailRow) : null;
      error = fallback.error;
    }

    if (error) {
      return { data: null, error: error.message };
    }

    if (!data) {
      return { data: null, error: null };
    }

    return {
      data: mapEventDetail(data, editionState.data, festivalState.data),
      error: null,
    };
  } catch (queryError) {
    return {
      data: null,
      error:
        queryError instanceof Error
          ? queryError.message
          : "No se pudo cargar el detalle publico del acto.",
    };
  }
}
