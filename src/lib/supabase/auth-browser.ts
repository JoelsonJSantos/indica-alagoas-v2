import {
  createBrowserClient,
} from "@supabase/ssr";

export function createAuthBrowserClient() {
  const supabaseUrl =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL;

  /*
   * Aceitamos a chave Publishable nova
   * e também a ANON legada que o projeto
   * já utiliza hoje.
   */
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

  return createBrowserClient(
    supabaseUrl,
    supabasePublicKey,
  );
}