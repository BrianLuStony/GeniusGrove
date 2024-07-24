// components/SignInButton.tsx
"use client";

import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export function SignInButton() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/login');
  };

  return (
    <Button className="dark:hover:bg-blue-600" onClick={handleSignIn}>Sign In</Button>
  );
}
