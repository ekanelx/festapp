import { SectionCard } from "@/components/shared/section-card";

export default function CmsAlertsPage() {
  return (
    <SectionCard
      eyebrow="CMS · Alertas"
      title="Base para avisos de edicion y de acto"
      description="La tabla `alerts` ya queda modelada para cubrir alertas globales o ligadas a un acto, con vigencia y prioridad."
    >
      <ul className="space-y-3 text-sm text-stone-700">
        <li>Estados base: draft, published, expired.</li>
        <li>Prioridades base: low, medium, high, critical.</li>
        <li>Push se deja fuera de esta fase, pero la entidad ya soporta crecer hacia ello.</li>
      </ul>
    </SectionCard>
  );
}

