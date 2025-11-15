"use client";

import { CardWrapper } from "./card-wrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoginSchema } from "@/schemas";
import * as z from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { login } from "@/actions/auth/login";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export function LoginForm() {
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider"
      : "";

  const router = useRouter();
  const cartId = localStorage.getItem("cart_Id");

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      login(values, cartId)
        .then((data) => {
          if (cartId) {
            localStorage.removeItem("cart_Id");
          }
          if (data?.error) {
            form.reset();
            setError(data?.error);
            return;
          }
          // if (data?.success) {
          //   form.reset();
          //   setSuccess(data?.success);
          //   return;
          // }
          // if (data?.twoFactor) {
          //   setShowTwoFactor(true);
          //   return;
          // }

          router.push("/management");
        })
        .catch((err) => {
          setError("Something went wrong .");
        });
    });
  };

  return (
    <CardWrapper
      headerLabel="Bienvenue"
      backButtonHref="/auth/register"
      subLabel="Connectez-vous pour consulter vos commentaires et effectuer vos demandes.">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="123456"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          className="border border-[#182233] py-6 rounded-[9.75px]"
                          {...field}
                          disabled={isPending}
                          placeholder="Username"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          className="border border-[#182233] py-6 rounded-[9.75px]"
                          disabled={isPending}
                          placeholder="Password"
                          type="password"
                        />
                      </FormControl>
                      {/* <Button
                        size={"sm"}
                        variant={"link"}
                        asChild
                        className="px-0 font-normal text-[#A4A4A4] flex justify-end">
                        <Link href={"/auth/reset"}>نسيت كلمة المرور ؟</Link>
                      </Button> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button
            type="submit"
            size={"lg"}
            variant={"brand"}
            disabled={isPending}
            className="w-full">
            Log in
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
