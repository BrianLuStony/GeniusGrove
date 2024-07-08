'use client';

import { useEffect, useState } from "react";
import CustomLink from "@/components/custom-link";
import { useSession } from "next-auth/react";
import Questionnaire from "../questionnaire/questionnaire"; 
import { CarouselItem,Carousel } from "../ui/carousel";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function MainPage() {
  const router = useRouter();
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

  const handleNavigation = (path: string) => () => {
    router.push(path);
  };


  if (showAnimation) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50">
        <h1 className="text-6xl md:text-8xl font-bold text-center animate-fadeIn">
          Genius Grove
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
        <Button
          className="hover:scale-110 hover:bg-cyan-700 text-lg py-3 px-6 h-14 w-full"
          onClick={handleNavigation('/register')}
        >
          Create your own account
        </Button>
      </div>
      <div>
        <Button
          className="hover:scale-110 hover:bg-cyan-700 text-lg py-3 px-6 h-14 w-full"
          onClick={handleNavigation('/login')}
        >
          Already have an account?
        </Button>
      </div>
      <div>
        Welcome to GeniusGrove, your AI-powered study environment! Here, you can:
        <ul>
          <li>Customize your learning experience across four core subjects: Biology, Mathematics, English, and Chemistry.</li>
          <li>Interact with our advanced AI tutor to get personalized assistance and explanations.</li>
          <li>Track your progress and receive tailored study recommendations.</li>
        </ul>
      </div>
      <div>
        Get started by selecting a subject:
        <ul>
          <li><CustomLink href="/subjects/bio" className="underline">Biology</CustomLink></li>
          <li><CustomLink href="/subjects/math" className="underline">Mathematics</CustomLink></li>
          <li><CustomLink href="/subjects/english" className="underline">English</CustomLink></li>
          <li><CustomLink href="/subjects/chem" className="underline">Chemistry</CustomLink></li>
        </ul>
      </div>
      <div>
        Our platform uses <CustomLink href="https://nextjs.authjs.dev">NextAuth.js</CustomLink> for secure authentication. 
        Create an account or log in to save your progress and access personalized features.
      </div>
      <div>
        Note: This is a dynamic learning environment. Your study materials and AI interactions are regularly updated to provide the most current and relevant educational content.
      </div>
      <div className="flex flex-col bg-gray-100 rounded-md">
      </div>
    </div>
  );
}
