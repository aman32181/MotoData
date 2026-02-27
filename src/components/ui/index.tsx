"use client";

import { clsx } from "clsx";
import type { ApiSource, ApiFetchResult } from "../../lib/type";

/* ================================================================
   ui/index.tsx — Shared atomic UI components
   ================================================================ */

/* ── Badge ── */
type BadgeVariant = "orange" | "green" | "red" | "yellow" | "gray" | "blue";

export function Badge({
  children,
  variant = "gray",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded px-2 py-0.5 font-mono text-[10px] font-medium tracking-wider uppercase border",
        {
          "bg-orange-500/10 text-orange-400 border-orange-500/25": variant === "orange",
          "bg-green-500/10 text-green-400 border-green-500/25": variant === "green",
          "bg-red-500/10 text-red-400 border-red-500/25": variant === "red",
          "bg-yellow-500/10 text-yellow-400 border-yellow-500/25": variant === "yellow",
          "bg-surface-4 text-text-muted border-border": variant === "gray",
          "bg-blue-500/10 text-blue-400 border-blue-500/25": variant === "blue",
        },
        className
      )}
    >
      {children}
    </span>
  );
}

/* ── Skeleton ── */
export function Skeleton({
  className,
  lines = 1,
}: {
  className?: string;
  lines?: number;
}) {
  return (
    <div className={clsx("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={clsx(
            "skeleton h-4 rounded",
            i === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  );
}

/* ── API Status Badge — shows which APIs loaded/failed ── */
const SOURCE_LABELS: Record<ApiSource, string> = {
  "api-ninjas-specs": "Specs",
  "carapi-trims": "Trims",
  "mock-recalls": "Recalls",
  "mock-pricing": "Pricing",
  "mock-reviews": "Reviews",
};

export function ApiStatusBar({
  results,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  results: ApiFetchResult<any>[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
        Data sources:
      </span>
      {results.map((r) => (
        <span
          key={r.source}
          className={clsx(
            "inline-flex items-center gap-1.5 rounded px-2 py-0.5 border font-mono text-[10px] tracking-wider uppercase",
            r.status === "ok"
              ? "bg-green-500/10 text-green-400 border-green-500/25"
              : r.status === "timeout"
              ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/25"
              : "bg-red-500/10 text-red-400 border-red-500/25"
          )}
        >
          <span
            className={clsx("h-1.5 w-1.5 rounded-full", {
              "bg-green-400": r.status === "ok",
              "bg-yellow-400": r.status === "timeout",
              "bg-red-400": r.status === "error",
            })}
          />
          {SOURCE_LABELS[r.source]}
          {r.latencyMs !== undefined && (
            <span className="opacity-60">{r.latencyMs}ms</span>
          )}
        </span>
      ))}
    </div>
  );
}

/* ── Stat Card — used in specs grid ── */
export function StatCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number | undefined;
  unit?: string;
}) {
  const isEmpty = value === undefined || value === null || value === "N/A" || value === "";
  return (
    <div className="rounded-lg border border-border bg-surface-2 p-4 space-y-1">
      <p className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
        {label}
      </p>
      {isEmpty ? (
        <div className="skeleton h-5 w-16 rounded" />
      ) : (
        <p className="text-lg font-semibold text-text-primary">
          {value}
          {unit && (
            <span className="ml-1 text-sm font-normal text-text-secondary">
              {unit}
            </span>
          )}
        </p>
      )}
    </div>
  );
}

/* ── Star Rating ── */
export function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          className={clsx("h-4 w-4", i < Math.round(rating) ? "text-orange-400" : "text-surface-5")}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/* ── Section Header ── */
export function SectionHeader({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
}) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="font-display text-2xl tracking-widest text-text-primary uppercase">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>
        )}
      </div>
      {badge && <Badge variant="orange">{badge}</Badge>}
    </div>
  );
}

/* ── Breadcrumb ── */
import Link from "next/link";

export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="flex items-center gap-1.5 font-mono text-xs text-text-muted mb-8">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-border">/</span>}
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-orange-400 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-text-secondary">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}