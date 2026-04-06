// components/root/handover/device/GenerateHandover.tsx
"use client";

import { generateHandoverDocx } from "@/app/actions/device-handover.action";
import { useState } from "react";

type Props = {
  deviceSlug: string;
  handoverId: number;
  templatePath: string; // passed from page, used only to confirm template exists
};

export default function GenerateHandover({ deviceSlug, handoverId }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);

    try {
      const result = await generateHandoverDocx(handoverId, deviceSlug);

      if ("error" in result) {
        setError(result.error);
        return;
      }

      // Reconstruct Buffer from the number array returned by the server action
      const uint8 = new Uint8Array(result.data);
      const blob = new Blob([uint8], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Generating...
          </>
        ) : (
          <>Generate Berita Acara</>
        )}
      </button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
