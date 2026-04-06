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
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { UpdateUserSchema } from "@/server/validators/user.validator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/generated/prisma";
import { updateUser } from "@/app/actions/user.actions";

type UpdateUserFormType = z.infer<typeof UpdateUserSchema>;

interface UpdateUserDialogProps {
  user: {
    id: number;
    name: string;
    email: string;
    username: string;
    role: UserRole;
    nip?: string | null;
  };
}

export default function UpdateUserDialog({ user }: UpdateUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<UpdateUserFormType>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      nip: user.nip ?? "",
    },
  });

  // Reset to fresh user data each time the dialog opens
  function handleOpenChange(value: boolean) {
    if (value) {
      form.reset({
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
        nip: user.nip ?? "",
      });
    }
    setOpen(value);
  }

  async function onSubmit(values: UpdateUserFormType) {
    startTransition(async () => {
      try {
        await updateUser(user.id, values);
        toast.success("User updated!");
        setOpen(false);
      } catch {
        toast.error("Something went wrong");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <p className="text-muted-foreground -mt-1 text-sm">
            Perbarui data user
          </p>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
          <FieldGroup>
            <div className="flex flex-col gap-4">
              <Controller
                name="name"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Full Name</FieldLabel>
                    <InputGroup>
                      <InputGroupInput {...field} placeholder="Nama Lengkap" />
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
                name="email"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Email</FieldLabel>
                    <InputGroup>
                      <InputGroupInput {...field} placeholder="Email" />
                    </InputGroup>
                  </Field>
                )}
              />

              <Controller
                name="nip"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>NIP</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        placeholder="Nomor Induk Pekerja"
                      />
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
                        <SelectValue placeholder="Pilih role..." />
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
                disabled={isPending || !form.formState.isDirty}
              >
                {isPending ? <Spinner /> : "Simpan Perubahan"}
              </Button>
            </DialogFooter>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
