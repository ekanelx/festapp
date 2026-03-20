import { redirect } from "next/navigation";

import { requireCmsSession } from "@/lib/cms/auth";

export default async function CmsEventsPage() {
  await requireCmsSession();
  redirect("/cms/ediciones");
}
