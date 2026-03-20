"use server";

import { redirect } from "next/navigation";

import { buildCmsLoginUrl, CMS_HOME_PATH, sanitizeCmsRedirect } from "@/lib/cms/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SUPABASE_ENV_ERROR } from "@/lib/supabase/env";

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const nextPath = sanitizeCmsRedirect(String(formData.get("next") ?? CMS_HOME_PATH));

  if (!email || !password) {
    redirect(buildCmsLoginUrl({ nextPath, error: "Completa email y password." }));
  }

  let supabase;

  try {
    supabase = await createSupabaseServerClient();
  } catch {
    redirect(buildCmsLoginUrl({ nextPath, error: SUPABASE_ENV_ERROR }));
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(buildCmsLoginUrl({ nextPath, error: "Credenciales invalidas o acceso no permitido." }));
  }

  const { data: role, error: roleError } = await supabase.rpc("current_app_role");

  if (roleError || !role) {
    await supabase.auth.signOut();
    redirect(buildCmsLoginUrl({ nextPath, error: "Tu usuario no tiene acceso activo al CMS." }));
  }

  redirect(nextPath);
}

export async function signOutAction() {
  let supabase;

  try {
    supabase = await createSupabaseServerClient();
  } catch {
    redirect(buildCmsLoginUrl({ error: SUPABASE_ENV_ERROR }));
  }

  await supabase.auth.signOut();
  redirect(buildCmsLoginUrl({ message: "Sesion cerrada." }));
}
