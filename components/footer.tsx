import CustomLink from "./custom-link"
import packageJSON from "next-auth/package.json"
import ThemeSwitcher from "./main-page/ThemeSwitcher"

export default function Footer() {
  return (
    <footer className="w-full dark:bg-slate-800">
      <div className="flex flex-col gap-4 px-4 text-sm sm:flex-row sm:justify-between sm:items-center sm:px-6 sm:mx-auto sm:max-w-3xl sm:h-16">
        <div className="flex flex-col gap-4 sm:flex-row dark:text-gray-300">
          <CustomLink href="https://www.pexels.com/">Image API: Pexels</CustomLink>
          <CustomLink href="https://www.npmjs.com/package/next-auth">
            NPM
          </CustomLink>
          <CustomLink href="https://github.com/BrianLuStony/GeniusGrove">
            Source on GitHub
          </CustomLink>
          {/* <CustomLink href="/policy">Policy</CustomLink> */}
        </div>
        <ThemeSwitcher />
      </div>
    </footer>
  )
}
