import CustomLink from "@/components/custom-link"
import { auth } from "auth"
import { useEffect, useState } from "react"
import MainPage from "@/components/main-page/main-page"
import { SessionProvider } from "next-auth/react"

export default async function Index() {
  const session = await auth()

  return (
    <div className="flex flex-col gap-6">
      <SessionProvider session={session}>
        <MainPage/>
      </SessionProvider>
    </div>
  )
}
