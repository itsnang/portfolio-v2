"use client";

import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth/auth-client";
import { LoginInput, loginSchema } from "@/db/schema/auth.schema";

export default function SignIn() {
  return (
    <div className="w-full sm:w-104 shadow-sm sm:p-5  border dark:border-zinc-800 rounded-md">
      <div className="p-5 space-y-5">
        <div className="text-center space-y-3">
          <h1 className="font-bold">Sign in to Portfolio CMS</h1>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex-1 h-[0.5px] w-full bg-zinc-400 dark:bg-zinc-800"></div>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}

export function SignInForm() {
  const [passwordReveal, setPasswordReveal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = authClient;

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      await signIn.email(
        {
          email: data.email,
          password: data.password,
          callbackURL: "/dashboard",
        },
        {
          onError: (ctx) => {
            console.error("Sign in error:", ctx.error);
            toast.error("Failed to sign in", {
              description: ctx.error.message,
              duration: 4000,
            });
            setIsLoading(false);
          },
          onSuccess: () => {
            toast.success("Sign in successfully", {
              duration: 4000,
            });
            setIsLoading(false);
          },
        }
      );
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-sm">Email</FormLabel>
              <FormControl>
                <Input
                  className="h-8"
                  placeholder="Email"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    className="h-8"
                    placeholder="Password"
                    type={passwordReveal ? "text" : "password"}
                    {...field}
                  />
                  <div
                    className="absolute right-2 top-[30%] cursor-pointer group"
                    onClick={() => setPasswordReveal(!passwordReveal)}
                  >
                    {/* Eye icon here */}
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit" disabled={isLoading}>
          <LoaderCircle
            className={cn("animate-spin size-4 mr-2", {
              hidden: !isLoading,
            })}
          />
          {isLoading ? "Signing in..." : "Continue"}
        </Button>
      </form>
    </Form>
  );
}
