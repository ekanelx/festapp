import { cache } from "react";

import { redirect } from "next/navigation";

import type { AppRole } from "@/lib/domain/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const CMS_HOME_PATH = "/cms";
export const CMS_LOGIN_PATH = "/acceso";
export const CMS_ROLE_DENIED_PARAM = "denied";

export type CmsLoginReason = "auth" | "inactive";

export type CmsSession = {
  userId: string;
  email: string | undefined;
  role: AppRole;
};

export function sanitizeCmsRedirect(candidate: string | null | undefined) {
  if (!candidate || !candidate.startsWith("/cms")) {
    return CMS_HOME_PATH;
  }

  return candidate;
}

export function buildCmsLoginUrl({
  nextPath,
  reason,
  error,
  message,
}: {
  nextPath?: string | null;
  reason?: CmsLoginReason;
  error?: string;
  message?: string;
}) {
  const params = new URLSearchParams();
  params.set("next", sanitizeCmsRedirect(nextPath));

  if (reason) {
    params.set("reason", reason);
  }

  if (error) {
    params.set("error", error);
  }

  if (message) {
    params.set("message", message);
  }

  return `${CMS_LOGIN_PATH}?${params.toString()}`;
}

export function getCmsLoginReasonLabel(reason: string | undefined) {
  if (reason === "inactive") {
    return "Tu sesion no tiene permisos activos para entrar al CMS.";
  }

  if (reason === "auth") {
    return "Inicia sesion para acceder al CMS.";
  }

  return null;
}

export const getOptionalCmsSession = cache(async (): Promise<CmsSession | null> => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: role, error } = await supabase.rpc("current_app_role");

  if (error || !role) {
    return null;
  }

  return {
    userId: user.id,
    email: user.email,
    role,
  };
});

export async function requireCmsSession() {
  const session = await getOptionalCmsSession();

  if (!session) {
    redirect(CMS_LOGIN_PATH);
  }

  return session;
}

export async function requireCmsRole(role: AppRole) {
  const session = await requireCmsSession();

  if (session.role !== role) {
    redirect(`${CMS_HOME_PATH}?${CMS_ROLE_DENIED_PARAM}=${role}`);
  }

  return session;
}
