"use client";

import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { Upload, Loader2, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  uploadDeviceHandoverTemplate,
  uploadDeviceTemplate,
} from "@/app/actions/device.action";

interface Props {
  deviceSlug: string;
  currentTemplate?: string | null;
  className?: string;
}

export default function UploadHandoverTemplate({
  deviceSlug,
  currentTemplate,
  className,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".docx")) {
      toast.error("Hanya file .docx yang diizinkan");
      return;
    }

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("deviceSlug", deviceSlug);

        await uploadDeviceHandoverTemplate(formData);
        toast.success("Template berhasil diupload");
      } catch (err: any) {
        toast.error(err?.message ?? "Gagal mengupload template");
      } finally {
        if (inputRef.current) inputRef.current.value = "";
      }
    });
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Current template indicator */}
      {currentTemplate && (
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <FileCheck className="size-3.5 text-green-500" />
          Template terpasang
        </span>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isPending}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary hover:text-primary-foreground active:scale-95 transition-all shadow-sm border disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="size-4" />
            {currentTemplate ? "Ganti Template" : "Upload Template"}
          </>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
