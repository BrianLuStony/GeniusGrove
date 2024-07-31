"use client"

import Image from "next/image"

import { cn } from "@/lib/utils"
import CustomLink from "./custom-link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu"
import React from "react"
import { Button } from "./ui/button"

export function MainNav() {
  return (
    <div className="flex gap-4 items-center ">
      <CustomLink href="/">
        <Button variant="ghost" className="p-0 dark:hover:bg-blue-600">
          <Image
            src="/logo.png"
            alt="Home"
            width="32"
            height="32"
            className="min-w-8"
          />
        </Button>
      </CustomLink>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem className="hidden">
            <NavigationMenuTrigger className="px-2  ">
              Server Side
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <ListItem href="/server-example" title="RSC Example">
                  Protecting React Server Component.
                </ListItem>
                <ListItem href="/middleware-example" title="Middleware Example">
                  Using Middleware to protect pages & APIs.
                </ListItem>
                <ListItem href="/api-example" title="Route Handler Example">
                  Getting the session inside an API Route.
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="px-2 dark:text-gray-200 dark:bg-primary hover:bg-gray-200 dark:hover:bg-blue-600">
              Subject
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] dark:text-gray-200 dark:bg-primary">
                <ListItem href="/subjects/mathematics" title="Mathematics">
                  Numbers, formulas and related structures
                </ListItem>
                <ListItem href="/subjects/english" title="English">
                  Vocabulary
                </ListItem>
                <ListItem href="/subjects/chemistry" title="Chemistry">
                  Study of the properties and behavior of matter
                </ListItem>
                <ListItem href="/subjects/biology" title="Biology">
                  Study of life
                </ListItem>
                <ListItem href="/subjects/physics" title="Physics">
                  Natural science of matter
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="px-2 dark:text-gray-200 dark:bg-primary hover:bg-gray-200 dark:hover:bg-blue-600">
              Quiz
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] dark:text-gray-200 dark:bg-primary">
                <ListItem href="/quizzes/mathematics" title="Mathematics">
                </ListItem>
                <ListItem href="/quizzes/english" title="English">
                </ListItem>
                <ListItem href="/quizzes/chemistry" title="Chemistry">
                </ListItem>
                <ListItem href="/quizzes/biology" title="Biology">
                </ListItem>
                <ListItem href="/quizzes/physics" title="Physics">
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
          <NavigationMenuLink
            href="/user-table"
            className={cn(navigationMenuTriggerStyle(), "dark:text-gray-200 dark:bg-primary hover:bg-gray-200 dark:hover:bg-blue-600")}
          >
            User Table
          </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-sm leading-snug line-clamp-2 text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
