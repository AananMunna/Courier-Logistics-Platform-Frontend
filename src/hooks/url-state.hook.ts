"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type ParamValue = string | number | boolean | null | undefined;

/**
 * Keeps filters, sorting, search and pagination in the URL
 * (`?page=2&status=DELIVERED`) so any view can be bookmarked or shared.
 * Must be rendered inside a <Suspense> boundary (Next.js requirement).
 */
export function useUrlState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getString = useCallback(
    (key: string, fallback = "") => searchParams.get(key) ?? fallback,
    [searchParams],
  );

  const getNumber = useCallback(
    (key: string, fallback: number) => {
      const parsed = Number(searchParams.get(key));
      return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
    },
    [searchParams],
  );

  /**
   * Merge `updates` into the URL. Empty values remove the key.
   * The page resets to 1 unless `page` itself is being changed.
   */
  const setParams = useCallback(
    (updates: Record<string, ParamValue>) => {
      const next = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === undefined || value === "") {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      }

      if (!("page" in updates)) {
        next.delete("page");
      } else if (next.get("page") === "1") {
        next.delete("page");
      }

      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  const reset = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  return { searchParams, getString, getNumber, setParams, reset };
}
