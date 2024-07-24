import { MainNav } from "./main-nav"
import UserButton from "./Sign-components/user-button"
import ThemeSwitcher from "@/components//main-page/ThemeSwitcher"
export default function Header() {
  return (
    <header className="sticky top-0 flex justify-center border-b bg-white z-50 dark:bg-slate-800">
      <div className="flex items-center justify-between w-full h-16 px-4 mx-auto sm:px-6">
        <MainNav />
        <UserButton />
      </div>
    </header>
  )
}
