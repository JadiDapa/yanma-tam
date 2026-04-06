"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ServiceType } from "@/server/validators/service.validator";

interface ServiceCardProps {
  service: ServiceType;
}

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

type ServiceStatus = "DRAFT" | "FINALIZED";

const STATUS_CONFIG: Record<
  ServiceStatus,
  { label: string; className: string }
> = {
  DRAFT: { label: "Draft", className: "bg-muted text-muted-foreground" },
  FINALIZED: {
    label: "Final",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  },
};

export default function ServiceCard({ service }: ServiceCardProps) {
  const { id, month, year, date, status, _count } = service;
  const statusCfg = STATUS_CONFIG[status as ServiceStatus];
  const deviceCount = _count?.serviceDevices ?? 0;
  const formattedDate = new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Link
      href={`/service/${id}`}
      className="group flex flex-col rounded-xl border bg-card shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200 overflow-hidden"
    >
      {/* Status accent bar */}
      <div
        className={cn(
          "h-1 w-full",
          status === "FINALIZED" ? "bg-green-500" : "bg-muted-foreground/20",
        )}
      />

      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Month + Year */}
        <div>
          <p className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
            {MONTHS[month - 1]}
          </p>
          <p className="text-sm text-muted-foreground">{year}</p>
        </div>

        {/* Status badge */}
        <div className="mt-auto pt-1">
          <span
            className={cn(
              "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
              statusCfg.className,
            )}
          >
            {statusCfg.label}
          </span>
        </div>
      </div>
    </Link>
  );
}
