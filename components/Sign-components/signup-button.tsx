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
    <div className="text-center mt-6">
      <span className="text-gray-600">Not a user yet?</span>{' '}
      <a href="/register" className="text-blue-600 hover:text-blue-800 font-semibold">
        Register
      </a>
    </div>
    // <Button onClick={handleSignIn}>Register</Button>
  );
}
