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
import { LoaderCircle, Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth/auth-client";
import { LoginInput, loginSchema } from "@/db/schema/auth.schema";

export default function SignIn() {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative overflow-hidden bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800 rounded-2xl">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-primary/5" />

        {/* Content */}
        <div className="relative p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                Welcome Back
              </h1>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Sign in to access Portfolio CMS
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-zinc-900 px-3 text-zinc-500 dark:text-zinc-400 tracking-wider">
                Continue with email
              </span>
            </div>
          </div>

          {/* Form */}
          <SignInForm />

          {/* Footer */}
          <div className="pt-4 text-center">
            <div className="flex items-center justify-center mt-2 gap-1">
              <Sparkles className="w-3 h-3 text-yellow-500" />
              <span className="text-xs text-zinc-400">
                Powered by Portfolio CMS
              </span>
            </div>
          </div>
        </div>
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Email Address
              </FormLabel>
              <FormControl>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    className="pl-10 h-12 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    placeholder="Enter your email"
                    type="email"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-red-500 text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Password
              </FormLabel>
              <FormControl>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    className="pl-10 pr-12 h-12 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    placeholder="Enter your password"
                    type={passwordReveal ? "text" : "password"}
                    {...field}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                    onClick={() => setPasswordReveal(!passwordReveal)}
                  >
                    {passwordReveal ? (
                      <EyeOff className="w-4 h-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />
                    ) : (
                      <Eye className="w-4 h-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-red-500 text-xs" />
            </FormItem>
          )}
        />

        <div className="pt-2">
          <Button
            className={cn(
              "w-full h-12 rounded-xl font-semibold shadow-lg transition-all duration-200",
              "bg-primary text-primary-foreground hover:bg-primary/90",
              "hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            )}
            type="submit"
            disabled={isLoading}
          >
            <LoaderCircle
              className={cn("animate-spin w-5 h-5 mr-2", {
                hidden: !isLoading,
              })}
            />
            {isLoading ? "Signing you in..." : "Sign In"}
          </Button>
        </div>

        {/* Additional options */}
        <div className="text-center pt-2">
          <button
            type="button"
            className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Forgot your password?
          </button>
        </div>
      </form>
    </Form>
  );
}
