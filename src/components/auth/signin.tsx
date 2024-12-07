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
import { UserLogins, userLoginsSchema } from "@/db/schema/user.schma";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInAction } from "@/app/sign-in/actions";

export default function SignIn() {
  return (
    <div className="w-full sm:w-[26rem] shadow sm:p-5  border dark:border-zinc-800 rounded-md">
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

  const form = useForm<UserLogins>({
    resolver: zodResolver(userLoginsSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: UserLogins) => {
    await signInAction(data.email, data.password);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold test-sm">Username</FormLabel>
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
          Continue
        </Button>
      </form>
    </Form>
  );
}
