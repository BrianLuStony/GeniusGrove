import { auth } from "auth";
import { redirect } from "next/navigation";
import LoginForm from "@/components/Sign-components/login-form";
import { GoogleSignInButton , GithubSignInButton} from "@/components/Sign-components/authButtons";

export default async function LoginPage() {
  const session = await auth();
  console.log({ session });

  if (session) {
    redirect("/");
  }

  return (
    <section className="bg-black h-screen flex items-center justify-center">
      <div className="w-[600px] space-y-6 p-6">
      <div className="space-y-4">
        <GithubSignInButton />
        <GoogleSignInButton />
      </div>
      <div className="border-t border-gray-300 my-6"></div>
        <LoginForm />
      </div>
    </section>
  );
}