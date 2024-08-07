'use client';
import {ThemeProvider} from "next-themes";
import { useEffect, useState } from "react";
import React from "react";

export default function Providers({children}: React.PropsWithChildren){
    // useEffect(() => {
    //     const updateDarkClass = () => {
    //       if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    //         document.documentElement.classList.add('dark')
    //       } else {
    //         document.documentElement.classList.remove('dark')
    //       }
    //     }
    
    //     updateDarkClass()
    
    //     window.addEventListener('storage', updateDarkClass)
    
    //     return () => window.removeEventListener('storage', updateDarkClass)
    //   }, [])
    
      return (
        <ThemeProvider attribute="class" defaultTheme='system' enableSystem={true}>
          {children}
        </ThemeProvider>
      )
}   