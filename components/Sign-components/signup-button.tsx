// components/SignInButton.tsx
"use client";

import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export function SignUpButton() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/register');
  };

  return (
    <Button onClick={handleSignIn}>Register</Button>
  );
}
