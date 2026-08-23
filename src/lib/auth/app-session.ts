export const APP_SESSION_COOKIE =
  "indica-alagoas-session-start";

export const APP_SESSION_DURATION_MS =
  24 * 60 * 60 * 1000;

export const APP_SESSION_MAX_AGE_SECONDS =
  24 * 60 * 60;

export function isAppSessionValid(
  value: string | undefined,
) {
  if (!value) {
    return false;
  }

  const startedAt =
    Number(value);

  if (
    !Number.isFinite(startedAt) ||
    startedAt <= 0
  ) {
    return false;
  }

  const elapsed =
    Date.now() - startedAt;

  return (
    elapsed >= 0 &&
    elapsed <
      APP_SESSION_DURATION_MS
  );
}