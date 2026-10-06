"use client";

import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useCurrentUser } from "@/hooks";
import type { UserRole } from "@/types";
import AccessDenied from "./access-denied";
import AuthLoading from "./auth-loading";

interface Props {
  children: ReactNode;
  roles: UserRole[];
}

/** Second line of defence behind proxy.ts: verifies the live session and role. */
export default function RoleGuard({ children, roles }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isPending } = useCurrentUser();

  useEffect(() => {
    if (!isPending && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isPending, user, router, pathname]);

  if (isPending) {
    return <AuthLoading />;
  }

  if (!user) {
    return <AuthLoading label="Redirecting to login…" />;
  }

  if (!roles.includes(user.role)) {
    return <AccessDenied role={user.role} />;
  }

  return <>{children}</>;
}
