"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { CreateDocumentationPeriodSchema } from "@/server/validators/documentation-period.validator";
import { createDocumentationPeriod } from "@/app/actions/documentation-period.action";

type DocumentationPeriodFormType = z.infer<
  typeof CreateDocumentationPeriodSchema
>;

export default function CreatePeriodDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<DocumentationPeriodFormType>({
    resolver: zodResolver(CreateDocumentationPeriodSchema),
    mode: "onChange",
    defaultValues: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      slug: `${new Date().getFullYear()}-${new Date().getMonth()}`,
      status: "DRAFT",
    },
  });

  async function onSubmit(values: DocumentationPeriodFormType) {
    startTransition(async () => {
      try {
        await createDocumentationPeriod({
          ...values,
          slug: `${values.year}-${values.month}`,
        });
        toast.success("Ticket created!");
        setOpen(false);
      } catch {
        toast.error("Something went wrong");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg  text-sm font-semibold hover:bg-primary active:scale-95 transition-all shadow-sm">
          <Plus />
          Tambah Dokumentasi
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Laporkan Kendala Absensi</DialogTitle>
          <p className="text-muted-foreground -mt-1 text-sm">
            Masukkan alasan kendala absensi
          </p>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
          <FieldGroup>
            <div className="flex gap-4">
              {/* Full Name */}
              <Controller
                name="year"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Tahun</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        type="number"
                        placeholder="Year"
                      />
                    </InputGroup>
                  </Field>
                )}
              />
              <Controller
                name="month"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Bulan</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        type="number"
                        placeholder="Month"
                      />
                    </InputGroup>
                  </Field>
                )}
              />
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isPending || !form.formState.isValid}
              >
                {isPending ? <Spinner /> : "Tambahkan"}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
