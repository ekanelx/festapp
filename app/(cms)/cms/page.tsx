import { SectionCard } from "@/components/shared/section-card";

export default function CmsHomePage() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <SectionCard
        eyebrow="Resumen"
        title="Direccion del CMS"
        description="El backoffice se construira en torno a una edicion activa y cuatro piezas de v1: actos, alertas, catalogos reutilizables y auth interna."
      >
        <ul className="space-y-3 text-sm text-stone-700">
          <li>Usuarios internos autenticados con Supabase Auth.</li>
          <li>Roles simples: `admin` y `editor`.</li>
          <li>CRUD basico sin workflow editorial complejo.</li>
          <li>Trazabilidad con `created_by`, `updated_by` y `audit_logs`.</li>
        </ul>
      </SectionCard>

      <SectionCard
        eyebrow="Pendiente"
        title="Lo que no se implementa aun"
        description="Esta fase no incluye formularios, tablas de datos ni RLS conectado al login real."
      >
        <ul className="space-y-3 text-sm text-stone-700">
          <li>Sin auth operativa ni proteccion middleware todavia.</li>
          <li>Sin listados conectados a Supabase.</li>
          <li>Sin importaciones, sin IA y sin push.</li>
          <li>Sin panel de usuarios internos.</li>
        </ul>
      </SectionCard>
    </div>
  );
}

