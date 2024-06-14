import { auth } from "auth";
import { redirect } from "next/navigation";
import LoginForm from "@/components/Sign-components/login-form";
import { GoogleSignInButton } from "@/components/Sign-components/authButtons";

export default async function LoginPage() {
  const session = await auth();
  console.log({ session });

  if (session) {
    redirect("/");
  }

  return (
    <section className="bg-black h-screen flex items-center justify-center">
      <div className="w-[600px]">
        <GoogleSignInButton />
        <LoginForm />;
      </div>
    </section>
  );
}