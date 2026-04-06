"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { FileDown, Loader2 } from "lucide-react";

interface Props {
  deviceSlug: string;
  periodSlug: string;
  templatePath: string;
}

export default function GenerateDocumentation({
  deviceSlug,
  periodSlug,
  templatePath,
}: Props) {
  const [isPending, startTransition] = useTransition();

  const handleDownload = () => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/documentation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deviceSlug, periodSlug, templatePath }),
        });

        if (!res.ok) throw new Error("Gagal generate dokumen");

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `dokumentasi-${deviceSlug}-${periodSlug}.docx`;
        a.click();
        URL.revokeObjectURL(url);

        toast.success("Dokumen berhasil diunduh");
      } catch (err: any) {
        toast.error(err?.message ?? "Gagal mengunduh dokumen");
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isPending}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border hover:bg-primary hover:text-primary-foreground active:scale-95 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <FileDown className="size-4" />
          Unduh Dokumentasi
        </>
      )}
    </button>
  );
}
