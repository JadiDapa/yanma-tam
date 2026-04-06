"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { HandoverType } from "@/server/validators/handover.validator";

// ─── Types ────────────────────────────────────────────────────────────────────

type HandoverStatus = "DRAFT" | "COMPLETE" | "APPROVED";

interface HandoverCardProps {
  handover: HandoverType;
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

// ─── Component ────────────────────────────────────────────────────────────────

export default function HandoverCard({ handover }: HandoverCardProps) {
  const { id, month, year } = handover;

  return (
    <Link
      href={`/handover/${id}`}
      className="group flex flex-col rounded-xl border bg-card shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200 overflow-hidden"
    >
      {/* Progress bar top accent */}
      <div className="h-1 w-full bg-muted">
        <div
          className={cn(
            "h-full transition-all duration-500",
            status === "APPROVED"
              ? "bg-green-500"
              : status === "COMPLETE"
                ? "bg-blue-500"
                : "bg-muted-foreground/30",
          )}
        />
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Month + Year */}
        <div>
          <p className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
            {MONTHS[month - 1]}
          </p>
          <p className="text-sm text-muted-foreground">{year}</p>
        </div>
      </div>
    </Link>
  );
}
