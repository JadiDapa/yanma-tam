"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { Eye, EyeClosed, LoaderCircle, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

const registerSchema = z.object({
  username: z.string().min(1, "Email tidak boleh kosong"),
  password: z.string().min(1, "Password tidak boleh kosong"),
});

export default function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const { signIn, setActive, isLoaded } = useSignIn();

  const router = useRouter();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    const { username, password } = values;
    if (!isLoaded) return;

    setIsLoading(true);
    try {
      const result = await signIn.create({ identifier: username, password });

      if (result.status === "complete" && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        toast.success("Berhasil Masuk!");

        router.push("/");
      } else {
        toast.error("Kombinasi Email dan Password Salah!");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Kombinasi Email dan Password Salah!");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mt-4 w-full lg:mt-6"
    >
      <FieldGroup>
        <div className="space-y-4">
          <Controller
            control={form.control}
            name="username"
            render={({ field, fieldState }) => (
              <Field className="relative">
                <InputGroup className="h-12">
                  <InputGroupInput
                    {...field}
                    className="ml-2"
                    aria-invalid={fieldState.invalid}
                    placeholder="Full Name"
                    autoComplete="off"
                  />
                  <InputGroupAddon>
                    <User />
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Field className="relative">
                <InputGroup className="h-12">
                  <InputGroupAddon>
                    <Lock />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    className="ml-2"
                    type={isVisible ? "text" : "password"}
                    aria-invalid={fieldState.invalid}
                    placeholder="Password"
                    autoComplete="off"
                  />
                  <InputGroupAddon
                    align="inline-end"
                    onClick={() => setIsVisible(!isVisible)}
                  >
                    {isVisible ? <Eye /> : <EyeClosed />}
                  </InputGroupAddon>
                </InputGroup>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <Button
          disabled={isLoading}
          className="flex h-10 w-full items-center gap-3 text-lg lg:h-12"
        >
          {isLoading ? (
            <>
              Memuat
              <LoaderCircle className="h-6 w-6 animate-spin text-gray-500" />
            </>
          ) : (
            "Masuk"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
