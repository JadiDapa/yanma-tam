"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { Eye, EyeClosed, LoaderCircle, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

const signupSchema = z
  .object({
    fullname: z.string().min(3, "Nama harus minimal 3 karakter"),
    nip: z.string().min(3, "Invalid nip"),
    password: z.string().min(6, "Password harus minimal 3 karakter"),
    confirmPassword: z.string().min(6, "Password harus minimal 3 karakter"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password Tidak Sama",
  });

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const { signUp, isLoaded } = useSignUp();

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullname: "",
      nip: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    if (!isLoaded) return;
    setIsLoading(true);

    try {
      await signUp.create({
        username: values.nip,
        password: values.password,
      });

      toast.info("Account Created Successfully!");
    } catch (error: any) {
      console.error("Sign-up error:", error);
      toast.error(error.errors?.[0]?.message || "Sign-up failed.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFormSubmit(values: z.infer<typeof signupSchema>) {
    await onSubmit(values as z.infer<typeof signupSchema>);
  }

  return (
    <form
      onSubmit={form.handleSubmit(handleFormSubmit)}
      className=" w-full lg:mt-6 "
    >
      <FieldGroup {...form}>
        <div className="space-y-4">
          <>
            {/* Full Name */}
            <Controller
              control={form.control}
              name="fullname"
              render={({ field, fieldState }) => (
                <Field className="">
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

            {/* NIP */}
            <Controller
              control={form.control}
              name="nip"
              render={({ field, fieldState }) => (
                <Field className="relative">
                  <InputGroup className="h-12">
                    <InputGroupInput
                      {...field}
                      className="ml-2"
                      aria-invalid={fieldState.invalid}
                      placeholder="NIP"
                      autoComplete="new-nip"
                    />
                    <InputGroupAddon>
                      <Mail />
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Password */}
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
            {/* Confirm Password */}
            <Controller
              control={form.control}
              name="confirmPassword"
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
                      placeholder="Confirm Password"
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
          </>
        </div>

        <Button
          disabled={isLoading}
          type="submit"
          className="flex w-full text-xl items-center justify-center gap-3 h-12 rounded-full"
        >
          {isLoading ? (
            <>
              Memuat
              <LoaderCircle className="h-8 w-6 animate-spin text-gray-500" />
            </>
          ) : (
            "Sign Up"
          )}
        </Button>
        <div id="clerk-captcha" />
      </FieldGroup>
    </form>
  );
}
