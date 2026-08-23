import {
  createServerClient,
} from "@supabase/ssr";

import {
  NextResponse,
  type NextRequest,
} from "next/server";

import {
  APP_SESSION_COOKIE,
  isAppSessionValid,
} from "@/lib/auth/app-session";

export async function updateAuthSession(
  request: NextRequest,
) {
  let response =
    NextResponse.next({
      request,
    });

  const supabaseUrl =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL;

  const supabasePublicKey =
    process.env
      .NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env
      .NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    !supabaseUrl ||
    !supabasePublicKey
  ) {
    throw new Error(
      "Variáveis públicas do Supabase não configuradas.",
    );
  }

  const supabase =
    createServerClient(
      supabaseUrl,
      supabasePublicKey,
      {
        cookies: {
          getAll() {
            return request.cookies
              .getAll();
          },

          setAll(
            cookiesToSet,
            headers,
          ) {
            cookiesToSet.forEach(
              ({
                name,
                value,
              }) => {
                request.cookies.set(
                  name,
                  value,
                );
              },
            );

            response =
              NextResponse.next({
                request,
              });

            cookiesToSet.forEach(
              ({
                name,
                value,
                options,
              }) => {
                response.cookies.set(
                  name,
                  value,
                  options,
                );
              },
            );

            Object.entries(
              headers,
            ).forEach(
              ([
                key,
                value,
              ]) => {
                response.headers.set(
                  key,
                  value,
                );
              },
            );
          },
        },
      },
    );

  /*
   * Primeiro deixa o Supabase
   * validar/renovar o token.
   */
  const {
    data,
  } =
    await supabase.auth
      .getClaims();

  const hasSupabaseSession =
    Boolean(
      data?.claims,
    );

  if (
    hasSupabaseSession
  ) {
    const startedAt =
      request.cookies.get(
        APP_SESSION_COOKIE,
      )?.value;

    /*
     * Existe sessão Supabase,
     * mas a janela de 24h acabou.
     *
     * Faz logout real e remove
     * os cookies da autenticação.
     */
    if (
      !isAppSessionValid(
        startedAt,
      )
    ) {
      await supabase.auth
        .signOut();

      response.cookies.delete(
        APP_SESSION_COOKIE,
      );
    }
  }

  return response;
}