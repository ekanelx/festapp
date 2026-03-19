export const siteConfig = {
  name: "Festapp",
  description:
    "Web app mobile-first para consultar actos de fiestas con rapidez, claridad y fiabilidad.",
  locale: "es-ES",
  demoFestivalSlug: "moros-y-cristianos",
  demoEditionSlug: "2026",
} as const;

export const publicNavigation = [
  { label: "Inicio", href: "/" },
  {
    label: "Demo publica",
    href: `/${siteConfig.demoFestivalSlug}/${siteConfig.demoEditionSlug}`,
  },
  { label: "CMS", href: "/cms" },
] as const;

export const cmsNavigation = [
  { label: "Resumen", href: "/cms" },
  { label: "Actos", href: "/cms/actos" },
  { label: "Alertas", href: "/cms/alertas" },
  { label: "Catalogo", href: "/cms/catalogo" },
] as const;

