import { format, formatDistanceToNowStrict, isValid, parseISO } from "date-fns";
import type { Decimal } from "@/types";

export function toNumber(value: Decimal | null | undefined): number {
  if (value === null || value === undefined || value === "") {
    return 0;
  }
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

const currencyFormatter = new Intl.NumberFormat("en-BD", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});

export function formatCurrency(value: Decimal | null | undefined) {
  return `৳${currencyFormatter.format(toNumber(value))}`;
}

export function formatNumber(value: Decimal | null | undefined) {
  return currencyFormatter.format(toNumber(value));
}

function toDate(value: string | Date | null | undefined) {
  if (!value) {
    return null;
  }
  const date = typeof value === "string" ? parseISO(value) : value;
  return isValid(date) ? date : null;
}

export function formatDate(value: string | Date | null | undefined) {
  const date = toDate(value);
  return date ? format(date, "dd MMM yyyy") : "—";
}

export function formatDateTime(value: string | Date | null | undefined) {
  const date = toDate(value);
  return date ? format(date, "dd MMM yyyy, hh:mm a") : "—";
}

export function formatShortDate(value: string | Date | null | undefined) {
  const date = toDate(value);
  return date ? format(date, "dd MMM") : "—";
}

export function formatTimeAgo(value: string | Date | null | undefined) {
  const date = toDate(value);
  return date ? `${formatDistanceToNowStrict(date)} ago` : "—";
}

export function getInitials(name: string | null | undefined) {
  if (!name) {
    return "U";
  }
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return `${first}${last}`.toUpperCase() || "U";
}

export function normalizePhone(value: string) {
  return value.replace(/[\s-]/g, "");
}

export function maskValue(value: string | null | undefined, visible = 4) {
  if (!value) {
    return "—";
  }
  if (value.length <= visible) {
    return value;
  }
  return `${"•".repeat(Math.max(value.length - visible, 0))}${value.slice(-visible)}`;
}

export function mapsSearchUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
