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
import { createService } from "@/app/actions/service.action";
import { CreateServiceSchema } from "@/server/validators/service.validator";

type FormType = z.infer<typeof CreateServiceSchema>;

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

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - 2 + i);

export default function ServiceCreateForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormType>({
    resolver: zodResolver(CreateServiceSchema),
    mode: "onChange",
    defaultValues: {
      month: new Date().getMonth() + 1,
      year: CURRENT_YEAR,
      date: new Date(),
      status: "DRAFT",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = form;

  const onSubmit = (values: FormType) => {
    startTransition(async () => {
      try {
        await createService(values);
        toast.success("Laporan servis berhasil disimpan");
        router.push("/service");
      } catch (err: any) {
        toast.error(err?.message ?? "Gagal menyimpan laporan");
      }
    });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Buat Laporan Servis"
        subtitle="Service Device — laporan dikelompokkan per bulan"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FieldGroup {...form}>
          <section className="rounded-xl border bg-card p-5 space-y-4 shadow-sm">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Konfigurasi Laporan
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Month */}
              <Controller
                name="month"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Bulan</FieldLabel>
                    <Select
                      value={String(field.value)}
                      onValueChange={(v) => field.onChange(Number(v))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih bulan..." />
                      </SelectTrigger>
                      <SelectContent>
                        {MONTHS.map((name, i) => (
                          <SelectItem key={i + 1} value={String(i + 1)}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />

              {/* Year */}
              <Controller
                name="year"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Tahun</FieldLabel>
                    <Select
                      value={String(field.value)}
                      onValueChange={(v) => field.onChange(Number(v))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tahun..." />
                      </SelectTrigger>
                      <SelectContent>
                        {YEARS.map((y) => (
                          <SelectItem key={y} value={String(y)}>
                            {y}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />

              {/* Date */}
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Tanggal</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        type="date"
                        value={
                          field.value instanceof Date
                            ? field.value.toISOString().split("T")[0]
                            : field.value
                        }
                        onChange={(e) =>
                          field.onChange(new Date(e.target.value))
                        }
                      />
                    </InputGroup>
                    {errors.date && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.date.message}
                      </p>
                    )}
                  </Field>
                )}
              />

              {/* Status */}
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Status</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="FINALIZED">Final</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            </div>
          </section>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isPending || !isValid}>
              {isPending ? <Spinner /> : "Simpan Laporan"}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
