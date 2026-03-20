import { createSupabaseAdminClient } from "./lib/supabase-admin.mjs";

function addDays(date, amount) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + amount);
  return nextDate;
}

function toDateOnly(value) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toEventDateTime(baseDate, time) {
  const [hours, minutes] = time.split(":").map(Number);
  const nextDate = new Date(baseDate);
  nextDate.setHours(hours, minutes, 0, 0);
  return nextDate.toISOString();
}

function buildMorosYCristianos(anchorDate) {
  const year = anchorDate.getFullYear();

  return {
    festival: {
      slug: "moros-y-cristianos",
      name: "Moros y Cristianos",
      city: "Alcoy",
      status: "published",
    },
    edition: {
      slug: String(year),
      name: `Edicion ${year}`,
      year,
      starts_on: toDateOnly(anchorDate),
      ends_on: toDateOnly(addDays(anchorDate, 4)),
      status: "published",
      is_current: true,
    },
    locations: [
      { name: "Plaza de Espana", address: "Plaza de Espana, Alcoy" },
      { name: "Avenida Pais Valencia", address: "Avenida Pais Valencia, Alcoy" },
      { name: "Teatro Calderon", address: "Plaza de Espana, 14, Alcoy" },
      { name: "Castillo de Fiestas", address: "Plaza Pintor Gisbert, Alcoy" },
      { name: "Parterre", address: "Passeig de Cervantes, Alcoy" },
    ],
    events: [
      {
        slug: "despertar-festero",
        title: "Despertar festero",
        shortDescription: "Inicio temprano de la jornada festera con recorrido breve.",
        dayOffset: 0,
        time: "08:00",
        locationName: "Parterre",
        status: "scheduled",
      },
      {
        slug: "reparto-de-programas",
        title: "Reparto de programas",
        shortDescription: "Punto de recogida del programa oficial y avisos del dia.",
        dayOffset: 0,
        time: "10:30",
        locationName: "Plaza de Espana",
        status: "scheduled",
      },
      {
        slug: "apertura-del-mercado-medieval",
        title: "Apertura del mercado medieval",
        shortDescription: "Apertura del mercado con animacion y puestos durante toda la manana.",
        changeNote: "Horario actualizado por coordinacion del montaje.",
        dayOffset: 0,
        time: "12:00",
        locationName: "Avenida Pais Valencia",
        status: "updated",
      },
      {
        slug: "concierto-de-bandas",
        title: "Concierto de bandas",
        shortDescription: "Actuacion conjunta de bandas participantes en la edicion actual.",
        dayOffset: 0,
        time: "19:30",
        locationName: "Teatro Calderon",
        status: "scheduled",
      },
      {
        slug: "entrada-de-bandas",
        title: "Entrada de bandas",
        shortDescription: "Desfile musical previo a los actos centrales de la noche.",
        dayOffset: 0,
        time: "22:00",
        locationName: null,
        status: "scheduled",
      },
      {
        slug: "diana-mora",
        title: "Diana mora",
        shortDescription: "Recorrido matinal de comparsas con salida temprana.",
        dayOffset: 1,
        time: "07:30",
        locationName: "Plaza de Espana",
        status: "scheduled",
      },
      {
        slug: "misa-mayor",
        title: "Misa mayor",
        shortDescription: "Celebracion principal de la jornada con acceso por orden de llegada.",
        dayOffset: 1,
        time: "11:00",
        locationName: "Teatro Calderon",
        status: "scheduled",
      },
      {
        slug: "mascleta-de-mediodia",
        title: "Mascleta de mediodia",
        shortDescription: "Acto pirotecnico previsto para primera hora de la tarde.",
        changeNote: "Acto cancelado por condiciones de seguridad.",
        dayOffset: 1,
        time: "14:00",
        locationName: "Parterre",
        status: "cancelled",
      },
      {
        slug: "entrada-cristiana",
        title: "Entrada cristiana",
        shortDescription: "Desfile principal de la tarde con paso por el eje central.",
        dayOffset: 1,
        time: "18:30",
        locationName: "Avenida Pais Valencia",
        status: "scheduled",
      },
      {
        slug: "verbenas-en-la-glorieta",
        title: "Verbenas en la glorieta",
        shortDescription: "Sesion nocturna abierta con musica en directo.",
        dayOffset: 1,
        time: "23:45",
        locationName: null,
        status: "scheduled",
      },
      {
        slug: "almuerzo-de-filaes",
        title: "Almuerzo de filaes",
        shortDescription: "Encuentro informal de filaes antes de los actos de tarde.",
        dayOffset: 2,
        time: "09:30",
        locationName: null,
        status: "scheduled",
      },
      {
        slug: "embajada-mora",
        title: "Embajada mora",
        shortDescription: "Representacion central de la jornada en el castillo festero.",
        changeNote: "Se retrasa media hora respecto al horario inicial.",
        dayOffset: 2,
        time: "17:30",
        locationName: "Castillo de Fiestas",
        status: "updated",
      },
      {
        slug: "retreta-infantil",
        title: "Retreta infantil",
        shortDescription: "Desfile infantil con recorrido adaptado para familias.",
        dayOffset: 2,
        time: "20:00",
        locationName: "Plaza de Espana",
        status: "scheduled",
      },
      {
        slug: "ofrenda-floral",
        title: "Ofrenda floral",
        shortDescription: "Ofrenda colectiva con concentracion previa en el centro.",
        dayOffset: 3,
        time: "10:00",
        locationName: "Plaza de Espana",
        status: "scheduled",
      },
      {
        slug: "procesion-general",
        title: "Procesion general",
        shortDescription: "Recorrido procesional por el tramo principal del festival.",
        dayOffset: 3,
        time: "19:00",
        locationName: "Avenida Pais Valencia",
        status: "scheduled",
      },
      {
        slug: "castillo-de-fuegos",
        title: "Castillo de fuegos",
        shortDescription: "Cierre final de la edicion con espectaculo pirotecnico.",
        dayOffset: 4,
        time: "23:00",
        locationName: "Parterre",
        status: "scheduled",
      },
    ],
    anchorDate,
  };
}

function buildFeriaDePrimavera(anchorDate) {
  const year = anchorDate.getFullYear();

  return {
    festival: {
      slug: "feria-de-primavera",
      name: "Feria de Primavera",
      city: "Ontinyent",
      status: "published",
    },
    edition: {
      slug: String(year),
      name: `Edicion ${year}`,
      year,
      starts_on: toDateOnly(anchorDate),
      ends_on: toDateOnly(addDays(anchorDate, 2)),
      status: "published",
      is_current: false,
    },
    locations: [
      { name: "Recinto Ferial", address: "Avenida Daniel Gil, Ontinyent" },
      { name: "Placa Major", address: "Placa Major, Ontinyent" },
      { name: "Parque de la Glorieta", address: "Carrer Dos de Maig, Ontinyent" },
    ],
    events: [
      {
        slug: "apertura-de-casetas",
        title: "Apertura de casetas",
        shortDescription: "Inicio de la feria con apertura de puestos y zona gastronomica.",
        dayOffset: 0,
        time: "18:00",
        locationName: "Recinto Ferial",
        status: "scheduled",
      },
      {
        slug: "pasacalle-inaugural",
        title: "Pasacalle inaugural",
        shortDescription: "Recorrido musical de bienvenida por el centro.",
        dayOffset: 0,
        time: "20:00",
        locationName: "Placa Major",
        status: "scheduled",
      },
      {
        slug: "concierto-pop-nocturno",
        title: "Concierto pop nocturno",
        shortDescription: "Actuacion principal de la noche en el recinto ferial.",
        dayOffset: 0,
        time: "22:30",
        locationName: "Recinto Ferial",
        status: "scheduled",
      },
      {
        slug: "muestra-artesana",
        title: "Muestra artesana",
        shortDescription: "Expositores locales y talleres abiertos durante la tarde.",
        dayOffset: 1,
        time: "11:00",
        locationName: "Parque de la Glorieta",
        status: "scheduled",
      },
      {
        slug: "tardeo-de-charangas",
        title: "Tardeo de charangas",
        shortDescription: "Ambiente de tarde con musica itinerante por la feria.",
        changeNote: "Pasa a empezar media hora mas tarde.",
        dayOffset: 1,
        time: "18:30",
        locationName: "Placa Major",
        status: "updated",
      },
      {
        slug: "sesion-dj-de-feria",
        title: "Sesion DJ de feria",
        shortDescription: "Cierre nocturno con musica en directo y acceso libre.",
        dayOffset: 1,
        time: "23:30",
        locationName: "Recinto Ferial",
        status: "scheduled",
      },
      {
        slug: "mercado-de-domingo",
        title: "Mercado de domingo",
        shortDescription: "Puestos abiertos de manana con producto local.",
        dayOffset: 2,
        time: "10:00",
        locationName: "Recinto Ferial",
        status: "scheduled",
      },
      {
        slug: "cierre-infantil",
        title: "Cierre infantil",
        shortDescription: "Actividades familiares para cerrar la edicion.",
        dayOffset: 2,
        time: "18:00",
        locationName: null,
        status: "scheduled",
      },
    ],
    anchorDate,
  };
}

function buildDemoDatasets() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return [
    buildMorosYCristianos(today),
    buildFeriaDePrimavera(addDays(today, 6)),
  ];
}

function mapEvents(events, anchorDate) {
  return events.map((event) => ({
    ...event,
    starts_at: toEventDateTime(addDays(anchorDate, event.dayOffset), event.time),
    review_status: "published",
    location_pending: event.locationName === null,
  }));
}

async function upsertFestival(supabase, festival) {
  const { data: existingFestival, error: existingFestivalError } = await supabase
    .from("festivals")
    .select("id")
    .eq("slug", festival.slug)
    .maybeSingle();

  if (existingFestivalError) {
    throw new Error(
      `No se pudo comprobar el festival ${festival.slug}. ${existingFestivalError.message}`,
    );
  }

  if (existingFestival) {
    const { data, error } = await supabase
      .from("festivals")
      .update(festival)
      .eq("id", existingFestival.id)
      .select("id")
      .single();

    if (error) {
      throw new Error(`No se pudo actualizar el festival ${festival.slug}. ${error.message}`);
    }

    return data.id;
  }

  const { data, error } = await supabase.from("festivals").insert(festival).select("id").single();

  if (error) {
    throw new Error(`No se pudo crear el festival ${festival.slug}. ${error.message}`);
  }

  return data.id;
}

async function upsertEdition(supabase, festivalId, edition) {
  const { data: existingEdition, error: existingEditionError } = await supabase
    .from("editions")
    .select("id")
    .eq("festival_id", festivalId)
    .eq("slug", edition.slug)
    .maybeSingle();

  if (existingEditionError) {
    throw new Error(`No se pudo comprobar la edicion ${edition.slug}. ${existingEditionError.message}`);
  }

  const payload = {
    festival_id: festivalId,
    slug: edition.slug,
    name: edition.name,
    year: edition.year,
    starts_on: edition.starts_on,
    ends_on: edition.ends_on,
    status: edition.status,
    is_current: edition.is_current,
  };

  if (existingEdition) {
    const { data, error } = await supabase
      .from("editions")
      .update(payload)
      .eq("id", existingEdition.id)
      .select("id")
      .single();

    if (error) {
      throw new Error(`No se pudo actualizar la edicion ${edition.slug}. ${error.message}`);
    }

    return data.id;
  }

  const { data, error } = await supabase.from("editions").insert(payload).select("id").single();

  if (error) {
    throw new Error(`No se pudo crear la edicion ${edition.slug}. ${error.message}`);
  }

  return data.id;
}

async function upsertLocations(supabase, festivalId, locations) {
  const payload = locations.map((location) => ({
    festival_id: festivalId,
    name: location.name,
    address: location.address,
  }));

  const { error } = await supabase.from("locations").upsert(payload, {
    onConflict: "festival_id,name",
  });

  if (error) {
    throw new Error(`No se pudieron sincronizar ubicaciones. ${error.message}`);
  }

  const { data, error: queryError } = await supabase
    .from("locations")
    .select("id,name")
    .eq("festival_id", festivalId)
    .in(
      "name",
      locations.map((location) => location.name),
    );

  if (queryError) {
    throw new Error(`No se pudieron leer ubicaciones. ${queryError.message}`);
  }

  return new Map((data ?? []).map((location) => [location.name, location.id]));
}

async function upsertEvents(supabase, editionId, locationIdsByName, events) {
  const payload = events.map((event) => ({
    edition_id: editionId,
    slug: event.slug,
    title: event.title,
    short_description: event.shortDescription ?? null,
    starts_at: event.starts_at,
    location_id: event.locationName ? locationIdsByName.get(event.locationName) ?? null : null,
    location_pending: event.location_pending,
    review_status: event.review_status,
    status: event.status,
    change_note: event.changeNote ?? null,
  }));

  const { error } = await supabase.from("events").upsert(payload, {
    onConflict: "edition_id,slug",
  });

  if (error) {
    throw new Error(`No se pudieron sincronizar los actos demo. ${error.message}`);
  }

  return payload.length;
}

async function syncDataset(supabase, dataset) {
  const festivalId = await upsertFestival(supabase, dataset.festival);
  const editionId = await upsertEdition(supabase, festivalId, dataset.edition);
  const locationIdsByName = await upsertLocations(supabase, festivalId, dataset.locations);
  const syncedEventCount = await upsertEvents(
    supabase,
    editionId,
    locationIdsByName,
    mapEvents(dataset.events, dataset.anchorDate),
  );

  return {
    festivalSlug: dataset.festival.slug,
    festivalId,
    editionId,
    syncedEventCount,
  };
}

async function main() {
  const supabase = createSupabaseAdminClient();
  const results = [];

  for (const dataset of buildDemoDatasets()) {
    results.push(await syncDataset(supabase, dataset));
  }

  console.log("Seed demo sincronizado correctamente.");

  results.forEach((result) => {
    console.log(`- festival: ${result.festivalSlug}`);
    console.log(`  festival_id: ${result.festivalId}`);
    console.log(`  edition_id: ${result.editionId}`);
    console.log(`  eventos_demo: ${result.syncedEventCount}`);
  });
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
