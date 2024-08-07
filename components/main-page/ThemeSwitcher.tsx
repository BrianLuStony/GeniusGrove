// 'use client'

// import { FiSun, FiMoon } from "react-icons/fi"
// import { useState, useEffect } from 'react'
// import Image from "next/image"
// import React from "react"

// export default function ThemeSwitcher() {
//   const [mounted, setMounted] = useState(false)
//   const [theme, setTheme] = useState('light')

//   useEffect(() => {
//     setMounted(true)
//     const storedTheme = localStorage.getItem('theme')
//     if (storedTheme) {
//       setTheme(storedTheme)
//     } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
//       setTheme('dark')
//     }
//   }, [])

//   useEffect(() => {
//     if (theme === 'dark') {
//       document.documentElement.classList.add('dark')
//     } else {
//       document.documentElement.classList.remove('dark')
//     }
//     localStorage.setItem('theme', theme)
//     // Dispatch an event to notify the Providers component
//     window.dispatchEvent(new Event('storage'))
//   }, [theme])

//   const toggleTheme = () => {
//     setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
//   }

//   if (!mounted) {
//     return (
//       <Image
//         src="data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNGRkZGRkYiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjIwMHB4IiB3aWR0aD0iMjAwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB4PSIyIiB5PSIyIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiIHJ4PSIyIj48L3JlY3Q+PC9zdmc+Cg=="
//         width={36}
//         height={36}
//         sizes="36x36"
//         alt="Loading Light/Dark Toggle"
//         priority={false}
//         title="Loading Light/Dark Toggle"
//       />
//     )
//   }

//   return theme === 'dark' 
//     ? <FiSun style={{ color: 'white' }} onClick={toggleTheme} /> 
//     : <FiMoon onClick={toggleTheme} />
// }

'use client'

import { FiSun, FiMoon } from "react-icons/fi"
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import Image from "next/image"
import React from "react"

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
  }

  if (!mounted) {
    return (
      <Image
        src="data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNGRkZGRkYiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjIwMHB4IiB3aWR0aD0iMjAwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB4PSIyIiB5PSIyIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiIHJ4PSIyIj48L3JlY3Q+PC9zdmc+Cg=="
        width={36}
        height={36}
        sizes="36x36"
        alt="Loading Light/Dark Toggle"
        priority={false}
        title="Loading Light/Dark Toggle"
      />
    )
  }

  return resolvedTheme === 'dark' 
    ? <FiSun style={{ color: 'white' }} onClick={toggleTheme} /> 
    : <FiMoon onClick={toggleTheme} />
}
