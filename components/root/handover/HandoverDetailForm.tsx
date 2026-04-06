"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import PageHeader from "@/components/root/PageHeader";
import { UserType } from "@/server/validators/user.validator";
import { FloorType } from "@/server/validators/floor.validator";
import { saveHandover } from "@/app/actions/handover.action";
import { DeviceHandoverType } from "@/server/validators/device-handover.validator";

// ─── Validators ──────────────────────────────────────────────────────────────

const FloorInspectionSchema = z.object({
  id: z.number(),
  floorId: z.number(),
  date: z.string().min(1, "Tanggal wajib diisi"),
  timeStart: z.string().min(1, "Jam mulai wajib diisi"),
  timeEnd: z.string().min(1, "Jam selesai wajib diisi"),
  supervisorId: z.string().min(1, "Supervisor wajib dipilih"),
});

const FormSchema = z.object({
  floorInspections: z.array(FloorInspectionSchema),
});

type FormType = z.infer<typeof FormSchema>;
type FloorInspectionType = z.infer<typeof FloorInspectionSchema>;

interface Props {
  deviceHandover?: DeviceHandoverType; // optional now
  handoverId: number; // needed when creating
  deviceSlug: string; // needed when creating
  floors: FloorType[];
  supervisors: UserType[];
}
function toDateInput(value: Date | string | null | undefined): string {
  if (!value) return "";
  return new Date(value).toISOString().split("T")[0];
}

function toTimeInput(value: string | null | undefined): string {
  return value ?? "";
}

export default function HandoverDetailForm({
  deviceHandover,
  handoverId,
  deviceSlug,
  floors,
  supervisors,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const defaultFloorInspections: FloorInspectionType[] = floors.map((f) => {
    const existing = deviceHandover?.floorInspections?.find(
      (fi) => fi.floorId === f.id,
    );
    return {
      id: existing?.id ?? 0,
      floorId: f.id,
      date: toDateInput(existing?.date),
      timeStart: toTimeInput(existing?.timeStart),
      timeEnd: toTimeInput(existing?.timeEnd),
      supervisorId: existing?.supervisorId ? String(existing.supervisorId) : "",
    };
  });

  const form = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      floorInspections: defaultFloorInspections,
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isDirty },
  } = form;

  // ── Autofill helpers ──────────────────────────────────────────────────────

  const applyToAll = (
    field: keyof Omit<FloorInspectionType, "floorId" | "id">,
    value: string,
  ) => {
    if (!value) return;
    floors.forEach((_, index) => {
      setValue(`floorInspections.${index}.${field}`, value, {
        shouldValidate: true,
        shouldDirty: true,
      });
    });
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const onSubmit = (values: FormType) => {
    startTransition(async () => {
      try {
        await saveHandover(deviceHandover?.id ?? null, {
          handoverId,
          deviceSlug,
          floorInspections: values.floorInspections,
        });
        toast.success(
          deviceHandover
            ? "Laporan berhasil diperbarui"
            : "Laporan berhasil dibuat",
        );
      } catch (err: any) {
        toast.error(err?.message ?? "Gagal menyimpan laporan");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup>
        {/* ── Per-Floor Inspections ──────────────────────────────────── */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Pemeriksaan Per Lantai
          </h3>

          {/* ── Autofill Panel ──────────────────────────────────────── */}
          <div className="rounded-xl border border-dashed bg-muted/20 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Isi Semua Lantai Sekaligus
              </span>
              <span className="text-xs text-muted-foreground/60">
                — kosongkan field yang tidak ingin diubah
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Field>
                <FieldLabel>Tanggal</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    type="date"
                    onChange={(e) => applyToAll("date", e.target.value)}
                  />
                </InputGroup>
              </Field>

              <Field>
                <FieldLabel>Jam Mulai</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    type="time"
                    onChange={(e) => applyToAll("timeStart", e.target.value)}
                  />
                </InputGroup>
              </Field>

              <Field>
                <FieldLabel>Jam Selesai</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    type="time"
                    onChange={(e) => applyToAll("timeEnd", e.target.value)}
                  />
                </InputGroup>
              </Field>

              <Field>
                <FieldLabel>Pengawas</FieldLabel>
                <Select onValueChange={(v) => applyToAll("supervisorId", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih pengawas..." />
                  </SelectTrigger>
                  <SelectContent>
                    {supervisors.map((u) => (
                      <SelectItem key={u.id} value={String(u.id)}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </div>

          {/* ── Floor Cards ─────────────────────────────────────────── */}
          {floors.map((f, index) => (
            <div
              key={f.id}
              className="rounded-xl border bg-card shadow-sm overflow-hidden"
            >
              <div className="px-5 py-3 bg-muted/40 border-b flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground w-6 text-center">
                  {index === 0 ? "B" : index}
                </span>
                <span className="text-sm font-semibold">{f.name}</span>
              </div>

              <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-4">
                <Controller
                  name={`floorInspections.${index}.date`}
                  control={control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Tanggal</FieldLabel>
                      <InputGroup>
                        <InputGroupInput type="date" {...field} />
                      </InputGroup>
                      {errors.floorInspections?.[index]?.date && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.floorInspections[index].date.message}
                        </p>
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name={`floorInspections.${index}.timeStart`}
                  control={control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Jam Mulai</FieldLabel>
                      <InputGroup>
                        <InputGroupInput type="time" {...field} />
                      </InputGroup>
                      {errors.floorInspections?.[index]?.timeStart && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.floorInspections[index].timeStart.message}
                        </p>
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name={`floorInspections.${index}.timeEnd`}
                  control={control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Jam Selesai</FieldLabel>
                      <InputGroup>
                        <InputGroupInput type="time" {...field} />
                      </InputGroup>
                      {errors.floorInspections?.[index]?.timeEnd && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.floorInspections[index].timeEnd.message}
                        </p>
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name={`floorInspections.${index}.supervisorId`}
                  control={control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Pengawas</FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih pengawas..." />
                        </SelectTrigger>
                        <SelectContent>
                          {supervisors.map((u) => (
                            <SelectItem key={u.id} value={String(u.id)}>
                              {u.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.floorInspections?.[index]?.supervisorId && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.floorInspections[index].supervisorId.message}
                        </p>
                      )}
                    </Field>
                  )}
                />
              </div>
            </div>
          ))}
        </section>

        {/* ── Actions ───────────────────────────────────────────────── */}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isPending || !isValid || !isDirty}>
            {isPending ? <Spinner /> : "Simpan Perubahan"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
