import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { buildCmsLoginUrl } from "@/lib/cms/auth";
import { getSupabaseEnv, SUPABASE_ENV_ERROR } from "@/lib/supabase/env";

function copyCookies(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie.name, cookie.value, cookie);
  });
}

export async function updateCmsSession(request: NextRequest) {
  let url: string;
  let anonKey: string;

  try {
    ({ url, anonKey } = getSupabaseEnv());
  } catch {
    return NextResponse.redirect(
      new URL(
        buildCmsLoginUrl({
          nextPath: `${request.nextUrl.pathname}${request.nextUrl.search}`,
          error: SUPABASE_ENV_ERROR,
        }),
        request.url,
      ),
    );
  }

  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

        response = NextResponse.next({
          request,
        });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const redirectToLogin = (reason?: string) => {
    const loginUrl = new URL(
      buildCmsLoginUrl({
        nextPath: `${request.nextUrl.pathname}${request.nextUrl.search}`,
        reason: reason === "inactive" ? "inactive" : "auth",
      }),
      request.url,
    );

    const redirectResponse = NextResponse.redirect(loginUrl);
    copyCookies(response, redirectResponse);
    return redirectResponse;
  };

  if (!user) {
    return redirectToLogin("auth");
  }

  const { data: role, error: roleError } = await supabase.rpc("current_app_role");

  if (roleError || !role) {
    return redirectToLogin("inactive");
  }

  return response;
}
