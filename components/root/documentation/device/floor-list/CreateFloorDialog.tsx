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
import { Card } from "@/components/ui/card";
import { CreateFloorSchema } from "@/server/validators/floor.validator";
import { createFloor } from "@/app/actions/floor.action";
import slugify from "slugify";

type FloorFormType = z.infer<typeof CreateFloorSchema>;

export default function CreateFloorDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<FloorFormType>({
    resolver: zodResolver(CreateFloorSchema),
    defaultValues: {
      name: "",
      order: 1,
    },
  });

  async function onSubmit(values: FloorFormType) {
    startTransition(async () => {
      try {
        await createFloor({
          ...values,
          slug: slugify(values.name),
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
        <Card className="cursor-pointer grid place-items-center border-4 border-dashed w-full h-32">
          <p className="text-center font-semibold text-xl">Tambah Floor </p>
          <Plus />
        </Card>
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
                name="name"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Name</FieldLabel>
                    <InputGroup>
                      <InputGroupInput {...field} placeholder="Nama Bagian" />
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
