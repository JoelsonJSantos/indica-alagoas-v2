"use server";

import {
  cookies,
} from "next/headers";

import {
  redirect,
} from "next/navigation";

import {
  APP_SESSION_COOKIE,
} from "@/lib/auth/app-session";

import {
  createAuthServerClient,
} from "@/lib/supabase/auth-server";

export async function logoutAction() {
  const supabase =
    await createAuthServerClient();

  await supabase.auth.signOut();

  const cookieStore =
    await cookies();

  cookieStore.delete(
    APP_SESSION_COOKIE,
  );

  redirect("/login");
}