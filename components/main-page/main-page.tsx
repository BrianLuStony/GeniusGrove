'use client';

import { useEffect, useState } from "react";
import CustomLink from "@/components/custom-link";
import { useSession } from "next-auth/react";
import Questionnaire from "../questionnaire/questionnaire"; 

export default function MainPage() {
  const { data: session, update } = useSession();
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 2000); // Duration of the animation in milliseconds

    return () => clearTimeout(timer);
  }, []);


  if (showAnimation) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50">
        <h1 className="text-6xl md:text-8xl font-bold text-center animate-fadeIn">
          Hello World
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">NextAuth.js Example</h1>
      <div>
        This is an example site to demonstrate how to use{" "}
        <CustomLink href="https://nextjs.authjs.dev">NextAuth.js</CustomLink>{" "}
        for authentication. Check out the{" "}
        <CustomLink href="/server-example" className="underline">
          Server
        </CustomLink>{" "}
        and the{" "}
        <CustomLink href="/client-example" className="underline">
          Client
        </CustomLink>{" "}
        examples to see how to secure pages and get session data.
      </div>
      <div>
        WebAuthn users are reset on every deploy, don't expect your test user(s)
        to still be available after a few days. It is designed to only
        demonstrate registration, login, and logout briefly.
      </div>
      <div className="flex flex-col bg-gray-100 rounded-md">
        <div className="p-4 font-bold bg-gray-200 rounded-t-md">
          Current Session
        </div>
        <pre className="py-6 px-4 whitespace-pre-wrap break-all">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  );
}
