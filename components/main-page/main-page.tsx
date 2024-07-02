'use client';

import { useEffect, useState } from "react";
import CustomLink from "@/components/custom-link";
import { useSession } from "next-auth/react";
import Questionnaire from "../questionnaire/questionnaire"; 
import { CarouselItem,Carousel } from "../ui/carousel";

export default function MainPage() {
  const { data: session, update } = useSession();
  const [showAnimation, setShowAnimation] = useState(true);

  const carouselItems: CarouselItem[] = [
    { content: "Welcome to Your Study Environment" },
    { content: "Customize Your Learning Experience" },
    { content: "Achieve Your Academic Goals" },
  ];

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
    <div className="flex flex-col gap-6 bg-[url('https://images.pexels.com/photos/743986/pexels-photo-743986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center h-screen">
      <div className="p-4 bg-gray-50 shadow-md rounded-lg relative z-0 ">
        <Carousel items={carouselItems} />
      </div>
      <h1 className="text-5xl flex font-bold items-center justify-center">Design your own study environment</h1>
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
      </div>
    </div>
  );
}
