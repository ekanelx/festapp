import { SectionCard } from "@/components/shared/section-card";

export default function CmsEventsPage() {
  return (
    <SectionCard
      eyebrow="CMS · Actos"
      title="Superficie reservada para CRUD basico"
      description="Aqui aterrizaremos en la siguiente fase el listado, filtros internos y formulario de alta/edicion de actos."
    >
      <ul className="space-y-3 text-sm text-stone-700">
        <li>Campos clave: titulo, fecha, horas, ubicacion, categoria, comparsa o filà y estado.</li>
        <li>Workflow inicial: draft, in_review, ready, published.</li>
        <li>Regla base: no publicar sin datos minimos ni ubicacion resuelta o pendiente explicita.</li>
      </ul>
    </SectionCard>
  );
}

