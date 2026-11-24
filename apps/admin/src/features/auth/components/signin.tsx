"use client";

import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@portfolio/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { cn } from "@portfolio/ui/cn";
import { authClient } from "@/lib/auth/auth-client";
import { LoginInput, loginSchema } from "@portfolio/db/schema";

export default function SignIn() {
  return (
    <div className="w-full max-w-[328px]">
      <div className="flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-md bg-foreground font-mono text-[11px] font-medium text-background">
          LS
        </span>
        <span className="text-sm font-medium">lornsamnang</span>
        <span className="rounded-sm border border-border bg-card px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Admin
        </span>
      </div>

      <h1 className="mt-14 text-[24px] font-medium leading-tight tracking-[-0.02em]">Welcome back</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Sign in to manage your Profile, Projects, Posts and everything else on the public Sites.
      </p>

      <div className="mt-8">
        <SignInForm />
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        The admin account is created by the site owner. There is no public sign-up.
      </p>
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="font-mono text-[11px] font-normal uppercase tracking-wider text-muted-foreground">
                Email
              </FormLabel>
              <FormControl>
                <div className="relative group">
                                    <Input
                    className="h-10"
                    autoComplete="email"
                    type="email"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="font-mono text-[11px] font-normal uppercase tracking-wider text-muted-foreground">
                Password
              </FormLabel>
              <FormControl>
                <div className="relative group">
                                    <Input
                    className="h-10 pr-10"
                    autoComplete="current-password"
                    type={passwordReveal ? "text" : "password"}
                    {...field}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={passwordReveal ? "Hide password" : "Show password"}
                    onClick={() => setPasswordReveal(!passwordReveal)}
                  >
                    {passwordReveal ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <div className="pt-2">
          <Button className="h-10 w-full bg-foreground text-background hover:bg-foreground/90 active:scale-[0.99]" type="submit" disabled={isLoading}>
            <LoaderCircle
              className={cn("animate-spin w-5 h-5 mr-2", {
                hidden: !isLoading,
              })}
            />
            {isLoading ? "Signing in…" : "Sign in"}
          </Button>
        </div>

      </form>
    </Form>
  );
}
