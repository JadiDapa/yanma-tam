"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { upsertFloorDeviceConfig } from "@/app/actions/floor-device-config.action";

interface Props {
  deviceSlug: string;
  floors: { slug: string; name: string }[];
  descriptionMap: Record<string, { title: string; description: string }>;
}

export default function FloorDescriptionEditor({
  deviceSlug,
  floors,
  descriptionMap,
}: Props) {
  const [isPending, startTransition] = useTransition();

  const handleBlur = (
    floorSlug: string,
    field: "title" | "description",
    value: string,
    current: { title: string; description: string },
  ) => {
    const updated = { ...current, [field]: value };
    startTransition(async () => {
      try {
        await upsertFloorDeviceConfig({
          floorSlug,
          deviceSlug,
          title: updated.title,
          description: updated.description,
        });
        toast.success("Disimpan");
      } catch {
        toast.error("Gagal menyimpan");
      }
    });
  };

  return (
    <div className="space-y-3">
      {floors.map((floor) => {
        const current = descriptionMap[floor.slug] ?? {
          title: "",
          description: "",
        };

        return (
          <div
            key={floor.slug}
            className="rounded-xl border bg-card overflow-hidden"
          >
            <div className="px-4 py-2 bg-muted/40 border-b">
              <span className="text-sm font-semibold">{floor.name}</span>
            </div>
            <div className="p-4 space-y-3">
              {/* Title */}
              <input
                type="text"
                className="w-full text-sm bg-transparent outline-none border-b pb-2 text-foreground placeholder:text-muted-foreground/40"
                defaultValue={current.title}
                placeholder="Judul lantai (e.g. LANTAI BASEMENT)..."
                onBlur={(e) =>
                  handleBlur(floor.slug, "title", e.target.value, current)
                }
                disabled={isPending}
              />
              {/* Description */}
              <textarea
                className="w-full text-sm bg-transparent resize-none outline-none text-muted-foreground placeholder:text-muted-foreground/40"
                rows={2}
                defaultValue={current.description}
                placeholder="Tulis deskripsi area lantai ini..."
                onBlur={(e) =>
                  handleBlur(floor.slug, "description", e.target.value, current)
                }
                disabled={isPending}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
