import type { EditionScaffold } from "@/lib/domain/types";

function titleize(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

export function getEditionScaffold(
  festivalSlug: string,
  editionSlug: string,
): EditionScaffold {
  const festivalName = titleize(festivalSlug);
  const editionName = editionSlug.toUpperCase();

  return {
    festivalName,
    festivalSlug,
    editionName,
    editionSlug,
    now: [
      {
        title: "Entrada de bandas",
        slug: "entrada-de-bandas",
        startsAt: "18:00",
        status: "scheduled",
        location: "Plaza Mayor",
        category: "Pasacalles",
        highlight: "Bloque pensado para resolver el home publico.",
      },
    ],
    today: [
      {
        title: "Pregón de fiestas",
        slug: "pregon-de-fiestas",
        startsAt: "20:30",
        status: "updated",
        location: "Ayuntamiento",
        category: "Institucional",
        highlight: "Usaremos este tipo de dato para agenda y detalle.",
      },
      {
        title: "Retreta infantil",
        slug: "retreta-infantil",
        startsAt: "22:00",
        status: "scheduled",
        location: "Avenida del Castell",
        category: "Infantil",
      },
    ],
    upcoming: [
      {
        title: "Desfile de comparsas",
        slug: "desfile-de-comparsas",
        startsAt: "10:00",
        status: "scheduled",
        location: "Calle Mayor",
        category: "Comparsas",
      },
      {
        title: "Embajada mora",
        slug: "embajada-mora",
        startsAt: "19:30",
        status: "scheduled",
        location: "Castillo",
        category: "Acto central",
      },
    ],
    historical: [
      {
        title: "Diana festera",
        slug: "diana-festera",
        startsAt: "08:00",
        status: "finished",
        location: "Centro historico",
        category: "Pasacalles",
      },
    ],
    alerts: [
      {
        title: "Cambio de recorrido",
        priority: "high",
        message: "La cabalgata se desplaza a la Calle Nueva por obras puntuales.",
      },
    ],
  };
}

