import { SectionCard } from "@/components/shared/section-card";

export default function CmsCatalogPage() {
  return (
    <SectionCard
      eyebrow="CMS · Catalogo"
      title="Catalogos reutilizables"
      description="Separar estas entidades desde el inicio evita meter JSON generico en actos y mantiene el modelo relacional limpio."
    >
      <ul className="space-y-3 text-sm text-stone-700">
        <li>Fiestas y ediciones: solo admin.</li>
        <li>Ubicaciones, categorias y comparsas o filàs: admin y editor.</li>
        <li>Relacion evento-comparsa o filà preparada como muchos-a-muchos para no quedarnos cortos.</li>
      </ul>
    </SectionCard>
  );
}
