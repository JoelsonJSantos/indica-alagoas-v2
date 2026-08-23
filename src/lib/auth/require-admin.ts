import {
  redirect,
} from "next/navigation";

import {
  getAppUser,
} from "@/lib/auth/get-app-user";

import {
  createAdminSupabaseClient,
} from "@/lib/supabase/admin";

export async function requireAdmin() {
  const user =
    await getAppUser();

  if (!user) {
    redirect("/login");
  }

  const supabase =
    createAdminSupabaseClient();

  const {
    data: profile,
    error,
  } = await supabase
    .from("user_profiles")
    .select(
      `
        user_id,
        full_name,
        role
      `,
    )
    .eq(
      "user_id",
      user.id,
    )
    .maybeSingle();

  if (error) {
    console.error(
      "Erro ao verificar administrador:",
      error,
    );

    throw new Error(
      "Não foi possível verificar a permissão.",
    );
  }

  if (
    !profile ||
    profile.role !== "admin"
  ) {
    redirect("/");
  }

  return {
    user,

    profile: {
      userId:
        profile.user_id,

      fullName:
        profile.full_name,

      role:
        "admin" as const,
    },
  };
}