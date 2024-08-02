import React from 'react';
import About from '@/components/about-us/about';
import Contact from '@/components/about-us/contact';


export default function AboutPage() {
  return (
    <div className="container mx-auto px-4">
      <About />
      <Contact />
    </div>
  );
}
