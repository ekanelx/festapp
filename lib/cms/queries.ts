import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { EventStatus, ReviewStatus } from "@/lib/domain/types";

type FestivalSummary = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  city: string | null;
  default_timezone: string;
  status: string;
};

type FestivalRelation = {
  id: string;
  name: string;
  slug: string;
  city?: string | null;
};

type EditionMetrics = {
  eventsCount: number;
  publishedEventsCount: number;
  relevantChangesCount: number;
};

type QueryState<T> = {
  data: T;
  error: string | null;
};

type RawFestivalRelation = FestivalRelation | FestivalRelation[] | null;

type EventMetricRow = {
  id: string;
  edition_id: string;
  status: EventStatus;
  review_status: ReviewStatus;
};

export type CmsFestivalSummary = FestivalSummary;

export type CmsEditionSummary = {
  id: string;
  festival_id: string;
  name: string;
  slug: string;
  year: number;
  starts_on: string;
  ends_on: string;
  timezone: string;
  status: string;
  is_current: boolean;
  festival: FestivalRelation | null;
  metrics: EditionMetrics;
};

type RawEditionSummary = Omit<CmsEditionSummary, "festival" | "metrics"> & {
  festival: RawFestivalRelation;
};

export type CmsFestivalTreeItem = CmsFestivalSummary & {
  editions: CmsEditionSummary[];
  metrics: {
    editionsCount: number;
    eventsCount: number;
    publishedEventsCount: number;
    relevantChangesCount: number;
  };
};

export type CmsEventListItem = {
  id: string;
  title: string;
  slug: string;
  starts_at: string;
  updated_at: string;
  status: EventStatus;
  review_status: ReviewStatus;
  short_description: string | null;
  change_note: string | null;
  location_pending: boolean;
  location: {
    id: string;
    name: string;
  } | null;
  edition: {
    id: string;
    name: string;
    slug: string;
    year: number;
    festival: {
      name: string;
      slug: string;
    } | null;
  } | null;
};

type RawEventListItem = Omit<CmsEventListItem, "location" | "edition"> & {
  location: { id: string; name: string } | { id: string; name: string }[] | null;
  edition:
    | {
        id: string;
        name: string;
        slug: string;
        year: number;
        festival: { name: string; slug: string } | { name: string; slug: string }[] | null;
      }
    | {
        id: string;
        name: string;
        slug: string;
        year: number;
        festival: { name: string; slug: string } | { name: string; slug: string }[] | null;
      }[]
    | null;
};

export type CmsLocationOption = {
  id: string;
  name: string;
  address: string | null;
};

export type CmsEventEditorEvent = {
  id: string;
  title: string;
  slug: string;
  starts_at: string;
  status: EventStatus;
  review_status: ReviewStatus;
  short_description: string | null;
  change_note: string | null;
  location_pending: boolean;
  location_id: string | null;
  published_at: string | null;
  location: {
    id: string;
    name: string;
    address: string | null;
  } | null;
  edition: {
    id: string;
    name: string;
    slug: string;
    year: number;
    timezone: string;
    festival_id: string;
    festival: {
      name: string;
      slug: string;
    } | null;
  } | null;
};

type RawCmsEventEditorEvent = Omit<CmsEventEditorEvent, "location" | "edition"> & {
  location:
    | { id: string; name: string; address: string | null }
    | { id: string; name: string; address: string | null }[]
    | null;
  edition:
    | {
        id: string;
        name: string;
        slug: string;
        year: number;
        timezone: string;
        festival_id: string;
        festival: { name: string; slug: string } | { name: string; slug: string }[] | null;
      }
    | {
        id: string;
        name: string;
        slug: string;
        year: number;
        timezone: string;
        festival_id: string;
        festival: { name: string; slug: string } | { name: string; slug: string }[] | null;
      }[]
    | null;
};

export type CmsEventEditorData = {
  event: CmsEventEditorEvent | null;
  locations: CmsLocationOption[];
  error: string | null;
};

export type CmsEventCreationData = {
  edition: CmsEditionSummary | null;
  locations: CmsLocationOption[];
  error: string | null;
};

async function safeQuery<TInput, TOutput>(
  query: PromiseLike<{ data: TInput[] | null; error: { message: string } | null }>,
  mapRow: (row: TInput) => TOutput,
): Promise<QueryState<TOutput[]>> {
  const { data, error } = await query;

  return {
    data: (data ?? []).map(mapRow),
    error: error?.message ?? null,
  };
}

function unwrapRelation<TRelation>(relation: TRelation | TRelation[] | null | undefined) {
  if (!relation) {
    return null;
  }

  return Array.isArray(relation) ? relation[0] ?? null : relation;
}

function emptyEditionMetrics(): EditionMetrics {
  return {
    eventsCount: 0,
    publishedEventsCount: 0,
    relevantChangesCount: 0,
  };
}

function mapFestival(row: FestivalSummary) {
  return row;
}

function mapEdition(row: RawEditionSummary): CmsEditionSummary {
  return {
    ...row,
    festival: unwrapRelation(row.festival),
    metrics: emptyEditionMetrics(),
  };
}

function mapEvent(row: RawEventListItem): CmsEventListItem {
  const edition = unwrapRelation(row.edition);

  return {
    ...row,
    location: unwrapRelation(row.location),
    edition: edition
      ? {
          ...edition,
          festival: unwrapRelation(edition.festival),
        }
      : null,
  };
}

function mapEditorEvent(row: RawCmsEventEditorEvent): CmsEventEditorEvent {
  const edition = unwrapRelation(row.edition);

  return {
    ...row,
    location: unwrapRelation(row.location),
    edition: edition
      ? {
          ...edition,
          festival: unwrapRelation(edition.festival),
        }
      : null,
  };
}

function mapLocation(row: CmsLocationOption) {
  return row;
}

function sortEditions(editions: CmsEditionSummary[]) {
  return [...editions].sort((left, right) => {
    if (left.is_current !== right.is_current) {
      return left.is_current ? -1 : 1;
    }

    if (left.starts_on !== right.starts_on) {
      return right.starts_on.localeCompare(left.starts_on);
    }

    return left.name.localeCompare(right.name, "es");
  });
}

function buildEditionMetrics(rows: EventMetricRow[]) {
  const metrics = new Map<string, EditionMetrics>();

  for (const row of rows) {
    const current = metrics.get(row.edition_id) ?? emptyEditionMetrics();

    current.eventsCount += 1;

    if (row.review_status === "published") {
      current.publishedEventsCount += 1;
    }

    if (row.status === "updated" || row.status === "cancelled") {
      current.relevantChangesCount += 1;
    }

    metrics.set(row.edition_id, current);
  }

  return metrics;
}

async function getEditionMetricsMap(supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>, editionIds: string[]) {
  if (!editionIds.length) {
    return {
      data: new Map<string, EditionMetrics>(),
      error: null,
    };
  }

  const { data, error } = await supabase
    .from("events")
    .select("id,edition_id,status,review_status")
    .in("edition_id", editionIds);

  return {
    data: buildEditionMetrics((data ?? []) as EventMetricRow[]),
    error: error?.message ?? null,
  };
}

function applyEditionMetrics(
  editions: CmsEditionSummary[],
  metricsMap: Map<string, EditionMetrics>,
) {
  return editions.map((edition) => ({
    ...edition,
    metrics: metricsMap.get(edition.id) ?? emptyEditionMetrics(),
  }));
}

async function getEditionsBase(params?: { festivalId?: string; editionId?: string }) {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("editions")
    .select(
      "id,festival_id,name,slug,year,starts_on,ends_on,timezone,status,is_current,festival:festivals(id,name,slug,city)",
    )
    .order("is_current", { ascending: false })
    .order("starts_on", { ascending: false })
    .order("name", { ascending: true });

  if (params?.festivalId) {
    query = query.eq("festival_id", params.festivalId);
  }

  if (params?.editionId) {
    query = query.eq("id", params.editionId);
  }

  const editions = await safeQuery<RawEditionSummary, CmsEditionSummary>(query, mapEdition);
  const metrics = await getEditionMetricsMap(
    supabase,
    editions.data.map((edition) => edition.id),
  );

  return {
    data: applyEditionMetrics(editions.data, metrics.data),
    error: editions.error ?? metrics.error,
  };
}

async function getFestivalLocations(festivalId: string) {
  const supabase = await createSupabaseServerClient();

  return safeQuery<CmsLocationOption, CmsLocationOption>(
    supabase
      .from("locations")
      .select("id,name,address")
      .eq("festival_id", festivalId)
      .order("name", { ascending: true }),
    mapLocation,
  );
}

export async function getCmsDashboardData() {
  const [festivals, editions, events] = await Promise.all([
    getCmsFestivalTree(),
    getCmsEditionsList(),
    getCmsEventsList(),
  ]);

  return { festivals, editions, events };
}

export async function getCmsFestivalTree(): Promise<QueryState<CmsFestivalTreeItem[]>> {
  const supabase = await createSupabaseServerClient();
  const festivals = await safeQuery<FestivalSummary, CmsFestivalSummary>(
    supabase
      .from("festivals")
      .select("id,name,slug,short_description,city,default_timezone,status")
      .order("name", { ascending: true }),
    mapFestival,
  );
  const editions = await getEditionsBase();

  const tree = festivals.data.map((festival) => {
    const festivalEditions = sortEditions(
      editions.data.filter((edition) => edition.festival_id === festival.id),
    );

    return {
      ...festival,
      editions: festivalEditions,
      metrics: {
        editionsCount: festivalEditions.length,
        eventsCount: festivalEditions.reduce((total, edition) => total + edition.metrics.eventsCount, 0),
        publishedEventsCount: festivalEditions.reduce(
          (total, edition) => total + edition.metrics.publishedEventsCount,
          0,
        ),
        relevantChangesCount: festivalEditions.reduce(
          (total, edition) => total + edition.metrics.relevantChangesCount,
          0,
        ),
      },
    };
  });

  return {
    data: tree,
    error: festivals.error ?? editions.error,
  };
}

export async function getCmsFestivalDetail(festivalId: string) {
  const tree = await getCmsFestivalTree();

  return {
    festival: tree.data.find((festival) => festival.id === festivalId) ?? null,
    error: tree.error,
  };
}

export async function getCmsEditionsList(): Promise<QueryState<CmsEditionSummary[]>> {
  return getEditionsBase();
}

export async function getCmsEditionDetail(editionId: string) {
  const editions = await getEditionsBase({ editionId });

  return {
    edition: editions.data[0] ?? null,
    error: editions.error,
  };
}

export async function getCmsEventsList(options?: { editionId?: string; limit?: number }) {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("events")
    .select(
      "id,title,slug,starts_at,updated_at,status,review_status,short_description,change_note,location_pending,location:locations(id,name),edition:editions(id,name,slug,year,festival:festivals(name,slug))",
    )
    .order("starts_at", { ascending: true })
    .order("title", { ascending: true });

  if (options?.editionId) {
    query = query.eq("edition_id", options.editionId);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  } else {
    query = query.limit(60);
  }

  return safeQuery<RawEventListItem, CmsEventListItem>(query, mapEvent);
}

export async function getCmsCatalogOverview() {
  const [festivals, editions] = await Promise.all([getCmsFestivalTree(), getCmsEditionsList()]);

  return { festivals, editions };
}

export async function getCmsEventEditorData(eventId: string): Promise<CmsEventEditorData> {
  const supabase = await createSupabaseServerClient();
  const { data: rawEvent, error: eventError } = await supabase
    .from("events")
    .select(
      "id,title,slug,starts_at,status,review_status,short_description,change_note,location_pending,location_id,published_at,location:locations(id,name,address),edition:editions(id,name,slug,year,timezone,festival_id,festival:festivals(name,slug))",
    )
    .eq("id", eventId)
    .maybeSingle();

  if (eventError) {
    return {
      event: null,
      locations: [],
      error: eventError.message,
    };
  }

  if (!rawEvent) {
    return {
      event: null,
      locations: [],
      error: null,
    };
  }

  const event = mapEditorEvent(rawEvent);
  const festivalId = event.edition?.festival_id;

  if (!festivalId) {
    return {
      event,
      locations: [],
      error: "No se ha podido resolver el festival asociado a este acto.",
    };
  }

  const locations = await safeQuery<CmsLocationOption, CmsLocationOption>(
    supabase
      .from("locations")
      .select("id,name,address")
      .eq("festival_id", festivalId)
      .order("name", { ascending: true }),
    mapLocation,
  );

  return {
    event,
    locations: locations.data,
    error: locations.error,
  };
}

export async function getCmsEventCreationData(editionId: string): Promise<CmsEventCreationData> {
  const { edition, error } = await getCmsEditionDetail(editionId);

  if (error) {
    return {
      edition: null,
      locations: [],
      error,
    };
  }

  if (!edition?.festival_id) {
    return {
      edition: edition ?? null,
      locations: [],
      error: "No se ha podido resolver el festival de esta edicion.",
    };
  }

  const locations = await getFestivalLocations(edition.festival_id);

  return {
    edition,
    locations: locations.data,
    error: locations.error,
  };
}
