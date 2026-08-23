import type {
  NextRequest,
} from "next/server";

import {
  updateAuthSession,
} from "@/lib/supabase/auth-proxy";

export async function proxy(
  request: NextRequest,
) {
  return updateAuthSession(
    request,
  );
}

export const config = {
  matcher: [
    /*
     * Executa nas rotas da aplicação,
     * mas ignora arquivos estáticos.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};