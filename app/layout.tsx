import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
// import Footer from "@/components/footer"
import Header from "@/components/header"
import Providers from "./providers"
import ThemeSwitcher from "@/components/main-page/ThemeSwitcher"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NextAuth.js Example",
  description:
    "This is an example site to demonstrate how to use NextAuth.js for authentication",
}

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
        <div className="flex flex-col justify-between w-full h-full min-h-screen">
          <Header />
          <main className="flex-auto w-full px-4 py-4 mx-auto sm:px-6 md:py-6">
            
            {children}
          </main>
          {/* <Footer /> */}
        </div>
        </Providers>
      </body>
    </html>
  )
}
