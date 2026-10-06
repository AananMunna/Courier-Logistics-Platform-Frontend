import type { ReactNode } from "react";

/** Re-mounts on every dashboard navigation so the page fades in and feels responsive. */
export default function DashboardTemplate({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="cg-fade">{children}</div>;
}
