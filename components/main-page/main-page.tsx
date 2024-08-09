'use client';

import { useEffect, useState } from "react";
import CustomLink from "@/components/custom-link";
import { useSession } from "next-auth/react";
import { CarouselItem, Carousel } from "../ui/carousel";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function MainPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [showAnimation, setShowAnimation] = useState(true);
  const [fontSize, setFontSize] = useState(18); // Default font size

  const carouselItems: CarouselItem[] = [
    { content: "Welcome to Genius Grove! 🎉" },
    { content: "Customize Your Learning Adventure 🛠️" },
    { content: "Achieve Your Dreams with Fun! 🌟" },
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

  return (
    <div
      className={`flex flex-col gap-6 min-h-screen dark:bg-gray-900 dark:text-gray-100 bg-gray-100 text-gray-900`}
      style={{
        fontFamily: 'Comic Sans MS, cursive',
        backgroundImage: `url("/background-stars.png")`,
        backgroundRepeat: 'repeat',
        padding: '20px',
      }}
    >
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-5xl font-bold flex items-center">
          Welcome to Genius Grove!
        </h1>
        <div className="flex items-center">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-full mr-2 hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
            onClick={() => setFontSize(prev => Math.max(prev - 2, 14))}
          >
            A-
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
            onClick={() => setFontSize(prev => Math.min(prev + 2, 28))}
          >
            A+
          </button>
        </div>
      </header>

      <div className="p-4 bg-yellow-100 shadow-md rounded-lg relative z-0 dark:bg-gray-800 dark:text-gray-100">
        <Carousel items={carouselItems} />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-around mt-8">
        <Button
          className="px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-all duration-300 transform hover:scale-105 mb-4 md:mb-0"
          onClick={handleNavigation('/register')}
          style={{ fontSize: `${fontSize}px` }}
        >
          Join the Fun! Create Your Account 🎈
        </Button>

        <Button
          className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
          onClick={handleNavigation('/login')}
          style={{ fontSize: `${fontSize}px` }}
        >
          Already on Board? Log In 🚪
        </Button>
      </div>

      <div className="p-6 rounded-lg shadow-md bg-white mt-8 border-2 border-blue-300 dark:bg-gray-800 dark:text-gray-100" style={{ fontSize: `${fontSize}px` }}>
        <h2 className="text-3xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Embark on a Learning Adventure! 🚀</h2>
        <p className="mb-4">At Genius Grove, you can:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Explore exciting subjects like Biology 🌿, Mathematics ➕, English 📚, Physics ⚛️, and Chemistry 🧪.</li>
          <li>Chat with our friendly AI tutor for fun explanations and assistance 🤖.</li>
          <li>Track your progress and earn cool badges and rewards 🏅.</li>
        </ul>
      </div>

      <div className="p-6 rounded-lg shadow-md bg-white mt-8 border-2 border-green-300 dark:bg-gray-800 dark:text-gray-100" style={{ fontSize: `${fontSize}px` }}>
        <h3 className="text-2xl font-semibold mb-4 text-green-600 dark:text-green-400">Choose a Subject to Begin:</h3>
        <ul className="grid grid-cols-2 gap-4">
          {[
            { name: 'Biology', emoji: '🌿' },
            { name: 'Mathematics', emoji: '➕' },
            { name: 'English', emoji: '📚' },
            { name: 'Chemistry', emoji: '🧪' },
            { name: 'Physics', emoji: '⚛️' },
          ].map((subject) => (
            <li key={subject.name}>
              <CustomLink
                href={`/subjects/${subject.name.toLowerCase()}`}
                className="block p-4 bg-pink-100 rounded-lg shadow hover:shadow-md transition-shadow text-center text-xl font-bold text-pink-600 hover:bg-pink-200 hover:scale-105 dark:bg-gray-700 dark:text-gray-100"
                style={{ fontSize: `${fontSize}px` }}
              >
                {subject.name} {subject.emoji}
              </CustomLink>
            </li>
          ))}
        </ul>
      </div>

      <footer className="text-center mt-8" style={{ fontSize: `${fontSize}px` }}>
        <p className="text-gray-700 dark:text-gray-300">
          🌟 Dive into the world of knowledge and have a blast learning! 🌟
        </p>
        <p className="text-gray-500 italic mt-2 dark:text-gray-400">
          Note: Our platform is ever-evolving to bring you the coolest learning experiences. Stay tuned for more adventures!
        </p>
      </footer>
    </div>
  );
}
