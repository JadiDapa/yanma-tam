"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
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
import { useEffect, useState, useTransition } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import PageHeader from "@/components/root/PageHeader";
import { createAttendanceList } from "@/app/actions/attendance-list.action";

// --- Schema & Types ---
const CreateAttendanceSchema = z.object({
  eosId: z.string().min(1, "Wajib memilih EOS"),
  supervisorId: z.string().min(1, "Wajib memilih Pengawas"),
  startDate: z.string().min(1, "Wajib mengisi tanggal mulai"),
  endDate: z.string().min(1, "Wajib mengisi tanggal akhir"),
});

type FormType = z.infer<typeof CreateAttendanceSchema>;
type EntryRow = { date: Date; checkIn: string; checkOut: string };
type UserOption = { id: string | number; name: string };

interface Props {
  eosList: UserOption[];
  supervisorList: UserOption[];
}

// --- Helpers ---
const DAY_ID = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const pad = (n: number) => String(n).padStart(2, "0");
const toDisplayDate = (d: Date) =>
  `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;

function getDefaultPeriod() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  return { start: fmt(start), end: fmt(end) };
}

function getWeekdays(startStr: string, endStr: string): Date[] {
  const days: Date[] = [];
  const [sy, sm, sd] = startStr.split("-").map(Number);
  const [ey, em, ed] = endStr.split("-").map(Number);
  const cur = new Date(sy, (sm ?? 1) - 1, sd ?? 1);
  const endDate = new Date(ey, (em ?? 1) - 1, ed ?? 1);
  while (cur <= endDate) {
    const d = cur.getDay();
    if (d !== 0 && d !== 6) days.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

function randomTime(sh: number, sm: number, eh: number, em: number) {
  const start = sh * 60 + sm;
  const end = eh * 60 + em;
  const rand = Math.floor(Math.random() * (end - start + 1)) + start;
  return `${pad(Math.floor(rand / 60))}.${pad(rand % 60)}`;
}

function CellInput({ value, onChange, placeholder }: any) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? "—"}
      className="w-full bg-transparent border-0 text-sm text-foreground placeholder-muted-foreground/40 focus:outline-none text-center py-0"
    />
  );
}

export default function AttendanceCreateForm({
  eosList,
  supervisorList,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [rows, setRows] = useState<EntryRow[]>([]);
  const [autoFillConfig, setAutoFillConfig] = useState({
    checkInStart: "07:50",
    checkInEnd: "08:00",
    checkOutStart: "17:00",
    checkOutEnd: "17:10",
  });

  const defaults = getDefaultPeriod();
  const form = useForm<FormType>({
    resolver: zodResolver(CreateAttendanceSchema),
    mode: "onChange",
    defaultValues: {
      eosId: "",
      supervisorId: "",
      startDate: defaults.start,
      endDate: defaults.end,
    },
  });

  const startDate = useWatch({ control: form.control, name: "startDate" });
  const endDate = useWatch({ control: form.control, name: "endDate" });

  useEffect(() => {
    if (!startDate || !endDate || startDate > endDate) {
      setRows([]);
      return;
    }
    const dates = getWeekdays(startDate, endDate);
    setRows((prev) =>
      dates.map((date, i) => ({
        date,
        checkIn: prev[i]?.checkIn ?? "",
        checkOut: prev[i]?.checkOut ?? "",
      })),
    );
  }, [startDate, endDate]);

  const updateRow = (
    index: number,
    field: "checkIn" | "checkOut",
    value: string,
  ) => {
    setRows((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)),
    );
  };

  const autoFillTimes = () => {
    const [ciSH, ciSM] = autoFillConfig.checkInStart.split(":").map(Number);
    const [ciEH, ciEM] = autoFillConfig.checkInEnd.split(":").map(Number);
    const [coSH, coSM] = autoFillConfig.checkOutStart.split(":").map(Number);
    const [coEH, coEM] = autoFillConfig.checkOutEnd.split(":").map(Number);

    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        checkIn: randomTime(ciSH, ciSM, ciEH, ciEM),
        checkOut: randomTime(coSH, coSM, coEH, coEM),
      })),
    );
  };

  const onSubmit = (values: FormType) => {
    startTransition(async () => {
      try {
        await createAttendanceList(values, rows);
        toast.success("Laporan absensi berhasil disimpan");
        router.push("/attendance");
      } catch (err: any) {
        toast.error(err?.message ?? "Gagal menyimpan laporan");
      }
    });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Rekapan Absensi Engineer On Site"
        subtitle="Pelayanan Markas — semua laporan dikelompokkan per bulan"
      />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FieldGroup {...form}>
          <section className="rounded-xl border bg-card p-5 space-y-5 shadow-sm">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Konfigurasi Laporan
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="startDate"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Mulai Periode</FieldLabel>
                    <InputGroup>
                      <InputGroupInput type="date" {...field} />
                    </InputGroup>
                  </Field>
                )}
              />
              <Controller
                name="endDate"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Akhir Periode</FieldLabel>
                    <InputGroup>
                      <InputGroupInput type="date" {...field} />
                    </InputGroup>
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="eosId"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Engineer On Site (EOS)</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih EOS..." />
                      </SelectTrigger>
                      <SelectContent>
                        {eosList.map((u) => (
                          <SelectItem key={u.id} value={String(u.id)}>
                            {u.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
              <Controller
                name="supervisorId"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Pengawas / Supervisor</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Supervisor..." />
                      </SelectTrigger>
                      <SelectContent>
                        {supervisorList.map((u) => (
                          <SelectItem key={u.id} value={String(u.id)}>
                            {u.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            </div>

            <Separator />

            {/* Range Config UI */}
            <div className="bg-muted/30 p-4 rounded-lg border space-y-4">
              <h4 className="text-xs font-bold uppercase text-muted-foreground">
                Pengaturan Auto-Isi
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium">
                    Jam Masuk (Range)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={autoFillConfig.checkInStart}
                      onChange={(e) =>
                        setAutoFillConfig((p) => ({
                          ...p,
                          checkInStart: e.target.value,
                        }))
                      }
                      className="bg-background border rounded px-2 py-1 text-sm w-full"
                    />
                    <span>-</span>
                    <input
                      type="time"
                      value={autoFillConfig.checkInEnd}
                      onChange={(e) =>
                        setAutoFillConfig((p) => ({
                          ...p,
                          checkInEnd: e.target.value,
                        }))
                      }
                      className="bg-background border rounded px-2 py-1 text-sm w-full"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium">
                    Jam Keluar (Range)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={autoFillConfig.checkOutStart}
                      onChange={(e) =>
                        setAutoFillConfig((p) => ({
                          ...p,
                          checkOutStart: e.target.value,
                        }))
                      }
                      className="bg-background border rounded px-2 py-1 text-sm w-full"
                    />
                    <span>-</span>
                    <input
                      type="time"
                      value={autoFillConfig.checkOutEnd}
                      onChange={(e) =>
                        setAutoFillConfig((p) => ({
                          ...p,
                          checkOutEnd: e.target.value,
                        }))
                      }
                      className="bg-background border rounded px-2 py-1 text-sm w-full"
                    />
                  </div>
                </div>
              </div>
              {rows.length > 0 && (
                <div className="flex justify-end pt-2 border-t">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={autoFillTimes}
                  >
                    Gunakan Auto-isi
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* Data Table Section */}
          <section className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Data Kehadiran
            </h3>
            {rows.length > 0 ? (
              <div className="rounded-xl border bg-card overflow-hidden">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left w-12">No</th>
                      <th className="px-4 py-3 text-left">Hari</th>
                      <th className="px-4 py-3 text-left">Tanggal</th>
                      <th className="px-4 py-3 text-center w-32">Masuk</th>
                      <th className="px-4 py-3 text-center w-32">Keluar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr
                        key={row.date.toISOString()}
                        className="border-b last:border-0 hover:bg-muted/30"
                      >
                        <td className="px-4 py-2.5 font-mono text-xs">
                          {i + 1}
                        </td>
                        <td className="px-4 py-2.5">
                          {DAY_ID[row.date.getDay()]}
                        </td>
                        <td className="px-4 py-2.5 font-mono">
                          {toDisplayDate(row.date)}
                        </td>
                        <td className="px-3 py-1.5 border-x">
                          <CellInput
                            value={row.checkIn}
                            onChange={(v: string) => updateRow(i, "checkIn", v)}
                          />
                        </td>
                        <td className="px-3 py-1.5">
                          <CellInput
                            value={row.checkOut}
                            onChange={(v: string) =>
                              updateRow(i, "checkOut", v)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed p-16 text-center text-muted-foreground">
                Pilih periode untuk memuat tabel
              </div>
            )}
          </section>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isPending || !form.formState.isValid}
            >
              {isPending ? <Spinner /> : "Simpan Laporan"}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
