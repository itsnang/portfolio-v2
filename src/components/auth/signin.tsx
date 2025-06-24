"use client";

import { useState, useTransition } from "react";
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
import { UserLogins, userLoginsSchema } from "@/db/schema/user.schma";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInAction } from "@/app/sign-in/actions";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function SignIn() {
  return (
    <div className="w-full sm:w-104 shadow-sm sm:p-5  border dark:border-zinc-800 rounded-md">
      <div className="p-5 space-y-5">
        <div className="text-center space-y-3">
          {/* <Image
            src={logo}
            alt="supabase logo"
            width={100}
            height={100}
            className="rounded-full mx-auto"
          /> */}
          <h1 className="font-bold">Sign in to Porfilo CMS</h1>
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
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<UserLogins>({
    resolver: zodResolver(userLoginsSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: UserLogins) => {
    startTransition(async () => {
      try {
        await signInAction(data.email, data.password);
        toast.success("Singin successfully");
        router.push("/dashboard");
      } catch (error) {
        console.log(error);
        toast.error("Sigin Error");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold test-sm">Email</FormLabel>
              <FormControl>
                <Input
                  className="h-8"
                  placeholder="Email"
                  type="text"
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
                <div className=" relative">
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
                    {/* {passwordReveal ? (
                      <FaRegEye className=" group-hover:scale-105 transition-all" />
                    ) : (
                      <FaRegEyeSlash className=" group-hover:scale-105 transition-all" />
                    )} */}
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          <LoaderCircle
            className={cn("animate-spin size-4 hidden", {
              block: isPending,
            })}
          />
          Continue
        </Button>
      </form>
    </Form>
  );
}
