"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import styles from './registerForm.module.css';
import useBackgroundImage from "../ui/useBackgroundImage";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

type FormData = z.infer<typeof FormSchema>;

export default function FormPage() {
  const router = useRouter();
  const { backgroundImage, loading: bgLoading, error: bgError } = useBackgroundImage("Education");
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log("Submitting form", data);

    const { username, email, password } = data;

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Process response here
      console.log("Registration Successful", response);
      toast({ title: "Registration Successful" });
      router.push('/');
    } catch (error: any) {
      console.error("Registration Failed:", error);
      toast({ title: "Registration Failed", description: error.message });
    }
  };

  const LoginPrompt = () => {
    return (
      <div className="text-center mt-6">
        <span className="text-gray-600">Already have an account?</span>{' '}
        <a href="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
          Login
        </a>
      </div>
    );
  };

  return (
    <div style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
  }} className="space-y-6 w-full max-w-xl mx-auto">
       <h1 className="font-semibold text-lg md:text-3xl">Sign Up</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="text-white p-8 md:p-12 border-2 rounded-xl border-gray-300 flex flex-col items-center justify-center gap-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className={`${styles.formField} w-full max-w-md`}>
                <FormControl>
                  <Input
                    className="text-black text-lg py-6 px-4 h-16 w-full"
                    placeholder=" "
                    {...field}
                    id="username"
                  />
                </FormControl>
                <label htmlFor="username">Username</label>
                <FormDescription className="text-sm text-gray-500 mt-1">
                  This is your public display name.
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className={`${styles.formField} w-full max-w-md`}>
                <FormControl>
                  <Input
                    className="text-black text-lg py-6 px-4 h-16 w-full"
                    placeholder=" "
                    {...field}
                    type="email"
                    id="email"
                  />
                </FormControl>
                <label htmlFor="email">Email</label>
                <FormDescription className="text-sm text-gray-500 mt-1">
                  Enter a valid email
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className={`${styles.formField} w-full max-w-md`}>
                <FormControl>
                  <Input
                    className="text-black text-lg py-6 px-4 h-16 w-full"
                    placeholder=" "
                    {...field}
                    type="password"
                    id="password"
                  />
                </FormControl>
                <label htmlFor="password">Password</label>
                <FormDescription className="text-sm text-gray-500 mt-1">
                  Password must be at least 6 characters
                </FormDescription>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="hover:scale-105 hover:bg-cyan-700 text-lg py-3 px-6 h-14 w-full max-w-md"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Registering..." : "Register"}
          </Button>
        </form>
      </Form>
      <LoginPrompt />
    </div>
  );
}