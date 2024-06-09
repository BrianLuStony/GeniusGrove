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
    <Button onClick={handleSignIn}>Sign In</Button>
  );
}
