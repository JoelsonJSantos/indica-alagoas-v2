import {
  createServerClient,
} from "@supabase/ssr";

import {
  cookies,
} from "next/headers";

export async function createAuthServerClient() {
  const cookieStore =
    await cookies();

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

  return createServerClient(
    supabaseUrl,
    supabasePublicKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },

        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(
              ({
                name,
                value,
                options,
              }) => {
                cookieStore.set(
                  name,
                  value,
                  options,
                );
              },
            );
          } catch {
            /*
             * Server Components não
             * conseguem escrever cookies.
             *
             * O Proxy será responsável
             * pela renovação da sessão.
             */
          }
        },
      },
    },
  );
}