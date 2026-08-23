import {
  getAppUser,
} from "@/lib/auth/get-app-user";

import {
  SiteHeaderClient,
} from "./site-header-client";

export async function SiteHeader() {
  const user =
    await getAppUser();

  return (
    <SiteHeaderClient
      isAuthenticated={
        Boolean(user)
      }
    />
  );
}