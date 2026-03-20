import { redirect } from "next/navigation";

import { requireCmsSession } from "@/lib/cms/auth";

export default async function CmsCatalogPage() {
  await requireCmsSession();
  redirect("/cms/festivales");
}
