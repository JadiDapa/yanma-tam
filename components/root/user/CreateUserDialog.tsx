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
import { CreateUserSchema } from "@/server/validators/user.validator";
import slugify from "slugify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/generated/prisma";
import { createUser } from "@/app/actions/user.actions";

type UserFormType = z.infer<typeof CreateUserSchema>;

export default function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<UserFormType>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      role: "GUEST",
      nip: "",
    },
  });

  async function onSubmit(values: UserFormType) {
    startTransition(async () => {
      try {
        await createUser({
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
        <Button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg  text-sm font-semibold hover:bg-primary active:scale-95 transition-all shadow-sm">
          <Plus />
          Tambah Pengguna
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Tambah User</DialogTitle>
          <p className="text-muted-foreground -mt-1 text-sm">
            Masukkan data user
          </p>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
          <FieldGroup>
            <div className="flex flex-col gap-4">
              {/* Full Name */}
              <Controller
                name="name"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Full Name</FieldLabel>
                    <InputGroup>
                      <InputGroupInput {...field} placeholder="Nama Bagian" />
                    </InputGroup>
                  </Field>
                )}
              />

              <Controller
                name="username"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Username</FieldLabel>
                    <InputGroup>
                      <InputGroupInput {...field} placeholder="Username" />
                    </InputGroup>
                  </Field>
                )}
              />

              <Controller
                name="role"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Role</FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih EOS..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(UserRole).map((u) => (
                          <SelectItem key={u} value={String(u)}>
                            {u}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
