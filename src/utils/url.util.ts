/** Drops empty values so optional filters never reach the API as `key=`. */
export function cleanParams<T extends object>(params: T | undefined) {
  if (!params) {
    return undefined;
  }

  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== "",
  );

  return Object.fromEntries(entries) as Partial<T>;
}

/** Only allow same-site relative redirects (prevents open-redirect abuse). */
export function getSafeRedirect(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return null;
  }
  if (value.startsWith("/login") || value.startsWith("/register")) {
    return null;
  }
  return value;
}
