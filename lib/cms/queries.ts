import { createSupabaseServerClient } from "@/lib/supabase/server";

type FestivalSummary = {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  status: string;
};

type EditionSummary = {
  id: string;
  name: string;
  slug: string;
  year: number;
  status: string;
  is_current: boolean;
  festival: {
    name: string;
    slug: string;
  } | null;
};

type RawEditionSummary = Omit<EditionSummary, "festival"> & {
  festival: { name: string; slug: string }[] | null;
};

type EventSummary = {
  id: string;
  title: string;
  slug: string;
  starts_at: string;
  status: string;
  review_status: string;
  edition: {
    name: string;
    slug: string;
  } | null;
};

type RawEventSummary = Omit<EventSummary, "edition"> & {
  edition: { name: string; slug: string }[] | null;
};

type QueryState<T> = {
  data: T;
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

function mapFestival(row: FestivalSummary) {
  return row;
}

function mapEdition(row: RawEditionSummary): EditionSummary {
  return {
    ...row,
    festival: row.festival?.[0] ?? null,
  };
}

function mapEvent(row: RawEventSummary): EventSummary {
  return {
    ...row,
    edition: row.edition?.[0] ?? null,
  };
}

export async function getCmsDashboardData() {
  const supabase = await createSupabaseServerClient();

  const [festivals, editions, events] = await Promise.all([
    safeQuery<FestivalSummary, FestivalSummary>(
      supabase
        .from("festivals")
        .select("id,name,slug,city,status")
        .order("name", { ascending: true })
        .limit(6),
      mapFestival,
    ),
    safeQuery<RawEditionSummary, EditionSummary>(
      supabase
        .from("editions")
        .select("id,name,slug,year,status,is_current,festival:festivals(name,slug)")
        .order("starts_on", { ascending: false })
        .limit(6),
      mapEdition,
    ),
    safeQuery<RawEventSummary, EventSummary>(
      supabase
        .from("events")
        .select("id,title,slug,starts_at,status,review_status,edition:editions(name,slug)")
        .order("starts_at", { ascending: true })
        .limit(8),
      mapEvent,
    ),
  ]);

  return { festivals, editions, events };
}

export async function getCmsEventsList() {
  const supabase = await createSupabaseServerClient();

  return safeQuery<RawEventSummary, EventSummary>(
    supabase
      .from("events")
      .select("id,title,slug,starts_at,status,review_status,edition:editions(name,slug)")
      .order("starts_at", { ascending: true })
      .limit(20),
    mapEvent,
  );
}

export async function getCmsCatalogOverview() {
  const supabase = await createSupabaseServerClient();

  const [festivals, editions] = await Promise.all([
    safeQuery<FestivalSummary, FestivalSummary>(
      supabase
        .from("festivals")
        .select("id,name,slug,city,status")
        .order("name", { ascending: true })
        .limit(12),
      mapFestival,
    ),
    safeQuery<RawEditionSummary, EditionSummary>(
      supabase
        .from("editions")
        .select("id,name,slug,year,status,is_current,festival:festivals(name,slug)")
        .order("starts_on", { ascending: false })
        .limit(12),
      mapEdition,
    ),
  ]);

  return { festivals, editions };
}
