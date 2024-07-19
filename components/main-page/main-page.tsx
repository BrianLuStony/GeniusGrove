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
    //bg-[url('https://images.pexels.com/photos/743986/pexels-photo-743986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')]
    <div className={`flex flex-col gap-6 bg-white dark:bg-none bg-cover bg-center h-screen
      dark:bg-slate-800 dark:text-white`}>    
        <div className="p-4 bg-gray-50 dark:bg-gray-700 shadow-md rounded-lg relative z-0">
          <Carousel items={carouselItems} />
        </div>
      <h1 className="text-5xl font-bold text-center mb-8">Design your own study environment</h1>

      <div className="space-y-4 mb-8">
        <Button
          className="hover:scale-105 transition-transform bg-cyan-600 hover:bg-cyan-700 text-white text-lg py-3 px-6 rounded-lg shadow-md dark:bg-cyan-700 dark:hover:bg-cyan-800"
          onClick={handleNavigation('/register')}
        >
          Create your own account
        </Button>
        
        <Button
          className="hover:scale-105 transition-transform bg-gray-200 hover:bg-gray-300 text-gray-800 text-lg py-3 px-6 rounded-lg shadow-md dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white"
          onClick={handleNavigation('/login')}
        >
          Already have an account?
        </Button>
      </div>

      <div className=" p-6 rounded-lg shadow-md mb-8 bg-white dark:bg-gray-700">
        <h2 className="text-2xl font-semibold mb-4">Welcome to GeniusGrove, your AI-powered study environment!</h2>
        <p className="mb-2">Here, you can:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Customize your learning experience across four core subjects: Biology, Mathematics, English, and Chemistry.</li>
          <li>Interact with our advanced AI tutor to get personalized assistance and explanations.</li>
          <li>Track your progress and receive tailored study recommendations.</li>
        </ul>
      </div>

      <div className="p-6 rounded-lg shadow-md mb-8 bg-white dark:bg-gray-700">
        <h3 className="text-xl font-semibold mb-4">Get started by selecting a subject:</h3>
        <ul className="grid grid-cols-2 gap-4">
          {['Biology', 'Mathematics', 'English', 'Chemistry', 'Physics'].map((subject) => (
            <li key={subject}>
              <CustomLink 
                href={`/subjects/${subject.toLowerCase()}`} 
                className="block p-4 bg-white dark:bg-gray-600 rounded-lg shadow hover:shadow-md transition-shadow text-center text-lg font-medium text-cyan-600 dark:text-cyan-300 hover:text-cyan-700 dark:hover:text-cyan-400"
              >
                {subject}
              </CustomLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Our platform uses <CustomLink href="https://nextjs.authjs.dev" className="text-cyan-600 hover:underline">NextAuth.js</CustomLink> for secure authentication. 
        Create an account or log in to save your progress and access personalized features.
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400 italic">
        Note: This is a dynamic learning environment. Your study materials and AI interactions are regularly updated to provide the most current and relevant educational content.
      </div>
      <div className="flex flex-col bg-gray-100 rounded-md">
      </div>
    </div>
  );
}
