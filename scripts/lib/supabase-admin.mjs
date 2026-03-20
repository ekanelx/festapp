import { createClient } from "@supabase/supabase-js";

import { loadProjectEnv, readRequiredEnv } from "./project-env.mjs";

export function createSupabaseAdminClient() {
  loadProjectEnv();

  const url = readRequiredEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = readRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function findAuthUserByEmail(supabase, email) {
  let page = 1;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 200,
    });

    if (error) {
      throw new Error(`No se pudo listar usuarios Auth. ${error.message}`);
    }

    const matchedUser = data.users.find((user) => user.email?.toLowerCase() === email);

    if (matchedUser) {
      return matchedUser;
    }

    if (data.users.length < 200) {
      return null;
    }

    page += 1;
  }
}

export async function ensureInternalUser({
  supabase,
  email,
  password,
  role,
  isActive,
  fullName,
}) {
  const normalizedEmail = email.trim().toLowerCase();
  const metadata = fullName ? { full_name: fullName } : {};

  let authUser = await findAuthUserByEmail(supabase, normalizedEmail);
  let authAction = "updated";

  if (authUser) {
    const { data, error } = await supabase.auth.admin.updateUserById(authUser.id, {
      email: normalizedEmail,
      password,
      email_confirm: true,
      user_metadata: metadata,
    });

    if (error || !data.user) {
      throw new Error(error?.message ?? "No se pudo actualizar el usuario en Supabase Auth.");
    }

    authUser = data.user;
  } else {
    authAction = "created";

    const { data, error } = await supabase.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,
      user_metadata: metadata,
    });

    if (error || !data.user) {
      throw new Error(error?.message ?? "No se pudo crear el usuario en Supabase Auth.");
    }

    authUser = data.user;
  }

  const { data: existingInternalUser, error: existingInternalUserError } = await supabase
    .from("internal_users")
    .select("id,email")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (existingInternalUserError) {
    throw new Error(
      `No se pudo comprobar internal_users para ${normalizedEmail}. ${existingInternalUserError.message}`,
    );
  }

  if (existingInternalUser && existingInternalUser.id !== authUser.id) {
    throw new Error(
      `Existe una fila en internal_users para ${normalizedEmail} con otro id. Corrige ese conflicto manualmente antes de continuar.`,
    );
  }

  const { error: upsertError } = await supabase.from("internal_users").upsert(
    {
      id: authUser.id,
      email: normalizedEmail,
      full_name: fullName,
      role,
      is_active: isActive,
    },
    {
      onConflict: "id",
    },
  );

  if (upsertError) {
    throw new Error(`No se pudo sincronizar internal_users. ${upsertError.message}`);
  }

  return {
    userId: authUser.id,
    email: normalizedEmail,
    role,
    isActive,
    authAction,
  };
}
