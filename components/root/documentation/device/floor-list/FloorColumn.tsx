"use client";

import { useRef, useTransition } from "react";
import { FloorType } from "@/server/validators/floor.validator";
import { Plus, Loader2, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import {
  deleteImage,
  uploadDocumentationImage,
} from "@/app/actions/documentation-image.action";

interface Props {
  floor: FloorType;
  deviceSlug: string;
  periodSlug: string;
}

export default function FloorColumn({ floor, deviceSlug, periodSlug }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [deletingIds, startDeleteTransition] = useTransition();

  // Track which image IDs are being deleted
  const deletingSet = useRef<Set<string | number>>(new Set());

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    startTransition(async () => {
      try {
        await Promise.all(
          files.map((file) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("floorSlug", floor.slug);
            formData.append("deviceSlug", deviceSlug);
            formData.append("periodSlug", periodSlug);
            return uploadDocumentationImage(formData);
          }),
        );
        toast.success(`${files.length} gambar berhasil diupload`);
      } catch (err: any) {
        toast.error(err?.message ?? "Gagal mengupload gambar");
      } finally {
        if (inputRef.current) inputRef.current.value = "";
      }
    });
  };

  const handleDelete = (imageId: string | number) => {
    if (!confirm("Hapus gambar ini? Tindakan tidak dapat dibatalkan.")) return;

    deletingSet.current.add(imageId);
    startDeleteTransition(async () => {
      try {
        await deleteImage(imageId);
        toast.success("Gambar berhasil dihapus");
      } catch (err: any) {
        toast.error(err?.message ?? "Gagal menghapus gambar");
      } finally {
        deletingSet.current.delete(imageId);
      }
    });
  };

  const allImages = floor.documentation.flatMap((doc) => doc.images);

  return (
    <div className="space-y-3 w-full">
      {/* Floor header */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {floor.name}
        </span>
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">
          {allImages.length} foto
        </span>
      </div>

      {/* Image strip */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {floor.documentation.map((doc) =>
          doc.images.map((img) => {
            const isDeleting = deletingSet.current.has(img.id);
            return (
              <div
                key={img.id}
                className="relative shrink-0 size-40 rounded-lg overflow-hidden border bg-muted group"
              >
                <Image
                  src={img.fileUrl}
                  alt={img.fileName ?? ""}
                  fill
                  className="object-cover"
                />

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => handleDelete(img.id)}
                  disabled={isDeleting}
                  className="absolute top-1.5 right-1.5 size-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed hover:bg-destructive/80 z-10"
                  aria-label="Hapus gambar"
                >
                  {isDeleting ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <X className="size-3.5" />
                  )}
                </button>
              </div>
            );
          }),
        )}

        {/* Upload button */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
          className="relative shrink-0 size-40 rounded-lg border-2 border-dashed bg-muted/30 hover:bg-muted/60 hover:border-primary/50 transition-all flex flex-col items-center justify-center gap-1 text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              <span className="text-xs font-medium">Uploading...</span>
            </>
          ) : (
            <>
              <Plus className="size-5" />
              <span className="text-xs font-medium">Upload</span>
            </>
          )}
        </button>

        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
