import {
  cookies,
} from "next/headers";

import type {
  User,
} from "@supabase/supabase-js";

import {
  APP_SESSION_COOKIE,
  isAppSessionValid,
} from "@/lib/auth/app-session";

import {
  createAuthServerClient,
} from "@/lib/supabase/auth-server";

export async function getAppUser(): Promise<User | null> {
  const cookieStore =
    await cookies();

  const sessionStartedAt =
    cookieStore.get(
      APP_SESSION_COOKIE,
    )?.value;

  if (
    !isAppSessionValid(
      sessionStartedAt,
    )
  ) {
    return null;
  }

  const supabase =
    await createAuthServerClient();

  const {
    data: {
      user,
    },
    error,
  } =
    await supabase.auth.getUser();

  if (
    error ||
    !user
  ) {
    return null;
  }

  return user;
}