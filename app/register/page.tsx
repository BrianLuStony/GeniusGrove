import { auth } from "auth";
import { redirect } from "next/navigation";

import FormPage from "@/components/Sign-components/register-form";

export default async function RegisterPage() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return (
    <section className="bg-[url('https://images.pexels.com/photos/743986/pexels-photo-743986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center h-screen flex items-center justify-center">
      <div className="w-[600px]">
        <FormPage />
      </div>
    </section>
  );
}