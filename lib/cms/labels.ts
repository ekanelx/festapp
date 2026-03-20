type FestivalLike = {
  name: string;
  city?: string | null;
};

type EditionLike = {
  year: number;
  name: string;
  festival?: FestivalLike | null;
};

export function formatFestivalEditorialLabel(festival: FestivalLike) {
  if (festival.city) {
    return `${festival.name} de ${festival.city}`;
  }

  return festival.name;
}

export function formatEditionEditorialLabel(edition: EditionLike) {
  if (edition.festival) {
    return `${formatFestivalEditorialLabel(edition.festival)} - ${edition.year}`;
  }

  return edition.name;
}
