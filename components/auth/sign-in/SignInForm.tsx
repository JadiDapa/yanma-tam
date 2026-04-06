"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useClerk, useSignIn } from "@clerk/nextjs";
import { toast } from "sonner";
import { Eye, EyeClosed, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  username: z.string().min(1, "Email tidak boleh kosong"),
  password: z.string().min(1, "Password tidak boleh kosong"),
});

type LoginFormType = z.infer<typeof loginSchema>;

export default function SignInForm() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { signIn } = useSignIn();
  const { setActive, loaded } = useClerk();
  const router = useRouter();

  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  function onSubmit(values: LoginFormType) {
    startTransition(async () => {
      if (!loaded) return;
      try {
        const result = await signIn.create({
          identifier: values.username,
          password: values.password,
        });

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
      }
    });
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
            render={({ field }) => (
              <Field>
                <InputGroup className="h-12">
                  <InputGroupInput
                    {...field}
                    className="ml-2"
                    placeholder="Email"
                    autoComplete="off"
                  />
                  <InputGroupAddon>
                    <User />
                  </InputGroupAddon>
                </InputGroup>
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="password"
            render={({ field }) => (
              <Field>
                <InputGroup className="h-12">
                  <InputGroupAddon>
                    <Lock />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    className="ml-2"
                    type={isVisible ? "text" : "password"}
                    placeholder="Password"
                    autoComplete="off"
                  />
                  <InputGroupAddon
                    align="inline-end"
                    className="cursor-pointer"
                    onClick={() => setIsVisible(!isVisible)}
                  >
                    {isVisible ? <Eye /> : <EyeClosed />}
                  </InputGroupAddon>
                </InputGroup>
              </Field>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={isPending || !loaded}
          className="flex h-10 w-full items-center gap-3 text-lg lg:h-12"
        >
          {isPending ? <Spinner /> : "Masuk"}
        </Button>
      </FieldGroup>
    </form>
  );
}
