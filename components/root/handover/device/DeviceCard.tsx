import { Device } from "@/generated/prisma";
import Link from "next/link";
import { ArrowUpRight, CircleDot } from "lucide-react";

export default function DeviceCard({
  device,
  handoverId,
}: {
  device: Device;
  handoverId: string;
}) {
  return (
    <Link
      href={`/handover/${handoverId}/${device.slug}`}
      className="group block"
    >
      <div className="relative overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/40">
        {/* Order badge — top left corner */}
        <div className="absolute top-0 left-0 bg-primary text-primary-foreground text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-br-lg">
          #{String(device.order).padStart(2, "0")}
        </div>

        {/* Arrow link indicator — top right */}
        <div className="absolute top-3 right-3 size-7 rounded-full border flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary transition-colors duration-200">
          <ArrowUpRight className="size-3.5" />
        </div>

        <div className="px-4 pt-10 pb-4 space-y-3">
          {/* Device name */}
          <h3 className="font-semibold text-base leading-tight pr-6 group-hover:text-primary transition-colors duration-200">
            {device.name}
          </h3>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Meta row */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CircleDot className="size-3" />
              <span className="font-mono">{device.slug}</span>
            </div>

            <span
              className={`flex items-center gap-1 font-medium ${
                device.isActive
                  ? "text-emerald-500"
                  : "text-muted-foreground/50"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  device.isActive ? "bg-emerald-500" : "bg-muted-foreground/50"
                }`}
              />
              {device.isActive ? "Aktif" : "Nonaktif"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
