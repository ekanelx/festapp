import type { NextRequest } from "next/server";

import { updateCmsSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return updateCmsSession(request);
}

export const config = {
  matcher: ["/cms/:path*"],
};
