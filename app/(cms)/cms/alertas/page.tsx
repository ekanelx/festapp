import { redirect } from "next/navigation";

import { requireCmsSession } from "@/lib/cms/auth";

export default async function CmsAlertsPage() {
  await requireCmsSession();
  redirect("/cms");
}
