"use client";

import React, { useTransition } from "react";

import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SignInSchema } from "@/app/schema/auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type SignInFormValues = z.infer<typeof SignInSchema>;

const SignInPage = () => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    startTransition(async () => {
      await authClient.signIn.email({
        email: data.email,

        password: data.password,
        fetchOptions: {
          onSuccess: () => {
            toast("User logged In successfully.", { position: "top-center" });
            router.push("/");
          },
          onError: (err) => {
            toast.error(err.error.message, {
              position: "top-center",
            });
          },
        },
      });
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Login with your account to get started
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Email</FieldLabel>

                  <Input
                    type="email"
                    placeholder="saif@example.com"
                    {...field}
                  />

                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Password</FieldLabel>

                  <Input type="password" placeholder="********" {...field} />

                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <button
              type="submit"
              className="w-full rounded-md bg-black px-4 py-2 text-white"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                "login"
              )}
            </button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignInPage;
