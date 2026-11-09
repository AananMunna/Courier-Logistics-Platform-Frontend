"use client";

import { useCurrentUser } from "@/hooks";

/** The only client piece of the customer hero: it needs the signed-in user's name. */
export function CustomerGreeting() {
  const { user } = useCurrentUser();
  return <>Hello, {user?.name.split(" ")[0] ?? "there"}</>;
}
