'use client';
import {ThemeProvider} from "next-themes";
import { useEffect, useState } from "react";
import React from "react";

export default function Providers({children}: React.PropsWithChildren){
    useEffect(() => {
        // Add event listener to update the 'dark' class on the html element
        const updateDarkClass = () => {
            if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
        }

        // Initial call to set the class
        updateDarkClass();

        // Listen for changes to the theme
        window.addEventListener('storage', updateDarkClass);

        return () => window.removeEventListener('storage', updateDarkClass);
    }, []);

    return (
        <ThemeProvider attribute="class" defaultTheme='system' enableSystem={true}>
            {children}
        </ThemeProvider>
    );
}   