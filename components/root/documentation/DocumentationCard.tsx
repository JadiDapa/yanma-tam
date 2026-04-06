"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type DocumentationStatus = "DRAFT" | "REVIEW" | "COMPLETED";

interface DocumentationPeriodCardProps {
  period: {
    id: number;
    slug: string;
    month: number;
    year: number;
    status: DocumentationStatus;
    _count: {
      documentations: number;
    };
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const STATUS_CONFIG: Record<
  DocumentationStatus,
  { label: string; bar: string; badge: string }
> = {
  DRAFT: {
    label: "Draft",
    bar: "bg-muted-foreground/20",
    badge: "bg-muted text-muted-foreground",
  },
  REVIEW: {
    label: "Review",
    bar: "bg-amber-400",
    badge:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  },
  COMPLETED: {
    label: "Selesai",
    bar: "bg-green-500",
    badge:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function DocumentationPeriodCard({
  period,
}: DocumentationPeriodCardProps) {
  const { slug, month, year, status, _count } = period;
  const cfg = STATUS_CONFIG[status];
  const docCount = _count.documentations;

  return (
    <Link
      href={`/documentation/${slug}`}
      className="group flex flex-col rounded-xl border bg-card shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200 overflow-hidden"
    >
      {/* Status accent bar */}
      <div className={cn("h-1 w-full", cfg.bar)} />

      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Month + Year */}
        <div>
          <p className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
            {MONTHS[month - 1]}
          </p>
          <p className="text-sm text-muted-foreground">{year}</p>
        </div>

        {/* Doc count */}
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground tabular-nums">
            {docCount}
          </span>{" "}
          dokumentasi
        </p>

        {/* Status badge */}
        <div className="mt-auto pt-1">
          <span
            className={cn(
              "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
              cfg.badge,
            )}
          >
            {cfg.label}
          </span>
        </div>
      </div>
    </Link>
  );
}
