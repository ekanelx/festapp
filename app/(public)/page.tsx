import { redirect } from "next/navigation";

import { SectionCard } from "@/components/shared/section-card";
import { getActivePublicEditionRoute } from "@/lib/public/queries";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const { data, error } = await getActivePublicEditionRoute();

  if (data) {
    redirect(`/${data.festivalSlug}/${data.editionSlug}`);
  }

  return (
    <SectionCard
      eyebrow={error ? "Error" : "Sin edicion activa"}
      title={error ? "No se ha podido cargar la portada publica" : "Todavia no hay una edicion publica activa"}
      description={
        error
          ? "La home publica depende ya de Supabase real y ahora mismo no ha podido resolver la edicion activa."
          : "Publica una edicion con `is_current = true` para que la portada redirija automaticamente a su home."
      }
    >
      <p className="text-sm text-stone-600">
        {error ??
          "Cuando exista una edicion activa publicada, `/` abrira esa agenda sin pasos intermedios."}
      </p>
    </SectionCard>
  );
}
