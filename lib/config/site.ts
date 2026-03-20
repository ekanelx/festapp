export const siteConfig = {
  name: "Festapp",
  description:
    "Web app mobile-first para consultar actos de fiestas con rapidez, claridad y fiabilidad.",
  locale: "es-ES",
} as const;

export const publicNavigation = [
  { label: "Inicio", href: "/" },
] as const;

export const cmsNavigation = [
  { label: "Inicio", href: "/cms" },
  { label: "Festivales", href: "/cms/festivales" },
] as const;
