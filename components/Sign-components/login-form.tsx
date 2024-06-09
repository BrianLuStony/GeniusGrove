"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { SignUpButton } from "@/components/Sign-components/signup-button";

const FormSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(4, {
    message: "Password must be at least 4 characters.",
  }),
});

type FormData = z.infer<typeof FormSchema>;

export default function LoginForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log("Submitting form", data);

    const { email, password } = data;

    try {
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      console.log({ response });

      if (response?.error) {
        console.log("Response error");
        setErrorMessage("Incorrect email or password");
        throw new Error(response.error);
      }

      // Successful login
      setErrorMessage(null);
      router.push("/");
      router.refresh();
      console.log("Login Successful", response);
      toast({ title: "Login Successful" });
    } catch (error: any) {
      // Login failed
      console.error("Login Failed:", error);
      toast({ title: "Login Failed", description: error.message });
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form} >
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="text-white p-4 md:p-16 border-[1.5px] rounded-lg border-gray-300 flex flex-col items-center justify-center gap-y-6"
        >
          {errorMessage && (
            <div className="text-red-500 mb-4">
              {errorMessage}
            </div>
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provide Email</FormLabel>
                <FormControl>
                  <Input
                    className="text-black space-y-6"
                    placeholder="Provide Email"
                    {...field}
                    type="text"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provide Password</FormLabel>
                <FormControl>
                  <Input
                    className="text-black space-y-6" 
                    placeholder="Provide Password"
                    {...field}
                    type="password"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="hover:scale-110 hover:bg-cyan-700"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Opening...." : "Open Sesame!"}
          </Button>
        </form>
      </Form>
      <SignUpButton />
    </div>
  );
}
