import {
  cookies,
} from "next/headers";

import {
  NextResponse,
} from "next/server";

import {
  APP_SESSION_COOKIE,
  APP_SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth/app-session";

import {
  createAdminSupabaseClient,
} from "@/lib/supabase/admin";

import {
  createAuthServerClient,
} from "@/lib/supabase/auth-server";

type LoginPayload = {
  email?: unknown;
  password?: unknown;
};

function errorResponse(
  message: string,
  status: number,
) {
  return NextResponse.json(
    {
      ok: false,
      message,
    },
    {
      status,
    },
  );
}

export async function POST(
  request: Request,
) {
  try {
    let payload: LoginPayload;

    try {
      payload =
        (await request.json()) as LoginPayload;
    } catch {
      return errorResponse(
        "Dados inválidos.",
        400,
      );
    }

    if (
      typeof payload.email !==
        "string" ||
      typeof payload.password !==
        "string"
    ) {
      return errorResponse(
        "Informe o e-mail e a senha.",
        400,
      );
    }

    const email =
      payload.email
        .trim()
        .toLowerCase();

    const password =
      payload.password;

    if (
      !email ||
      !password
    ) {
      return errorResponse(
        "Informe o e-mail e a senha.",
        400,
      );
    }

    const supabase =
      await createAuthServerClient();

    const {
      data,
      error,
    } =
      await supabase.auth
        .signInWithPassword({
          email,
          password,
        });

    if (
      error ||
      !data.user
    ) {
      return errorResponse(
        "E-mail ou senha inválidos.",
        401,
      );
    }

    /*
     * O login público do Indica Alagoas
     * aceita somente:
     *
     * - profissionais;
     * - administradores.
     *
     * Não existe conta social de visitante.
     */
    const adminSupabase =
      createAdminSupabaseClient();

    const {
      data: profile,
      error: profileError,
    } = await adminSupabase
      .from("user_profiles")
      .select("role")
      .eq(
        "user_id",
        data.user.id,
      )
      .maybeSingle();

    if (
      profileError ||
      !profile
    ) {
      await supabase.auth
        .signOut();

      return errorResponse(
        "Conta sem permissão de acesso.",
        403,
      );
    }

    if (
      profile.role !==
        "admin" &&
      profile.role !==
        "professional"
    ) {
      await supabase.auth
        .signOut();

      return errorResponse(
        "Conta sem permissão de acesso.",
        403,
      );
    }

    /*
     * Início real da sessão do portal.
     *
     * HttpOnly:
     * JavaScript do navegador não lê.
     *
     * maxAge:
     * máximo absoluto de 24 horas.
     */
    const cookieStore =
      await cookies();

    cookieStore.set(
      APP_SESSION_COOKIE,
      Date.now().toString(),
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite: "lax",

        path: "/",

        maxAge:
          APP_SESSION_MAX_AGE_SECONDS,
      },
    );

    return NextResponse.json({
      ok: true,
      role: profile.role,
    });
  } catch (error) {
    console.error(
      "Erro em POST /api/auth/login:",
      error,
    );

    return errorResponse(
      "Não foi possível entrar.",
      500,
    );
  }
}