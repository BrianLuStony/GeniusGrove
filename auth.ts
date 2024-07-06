import NextAuth from "next-auth"
import "next-auth/jwt"
import { encode, decode } from 'next-auth/jwt'
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from 'next-auth/providers/credentials'
import { createStorage } from "unstorage"
import memoryDriver from "unstorage/drivers/memory"
import vercelKVDriver from "unstorage/drivers/vercel-kv"
import { UnstorageAdapter } from "@auth/unstorage-adapter"
import type { NextAuthConfig } from "next-auth"
import { compare } from 'bcrypt-ts';
import { getUser, createUser } from "./db"
import type { DefaultSession} from "next-auth"


export const config = {
  theme: { logo: "https://authjs.dev/img/logo-sm.png" },
  session: {
    strategy: 'jwt',
  },
  jwt: { encode, decode },
  providers: [
    GitHub,
    Google,
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize({ email, password }: any) {
        if (!email || !password) {
          console.error("No credentials provided");
          return null;
        }
        const user = await getUser(email);
        if (!user || user.length === 0) {
          console.error("No user found with email:", email);
          return null;
        }
        const passwordsMatch = await compare(password, user[0].password!);
        //console.log(passwordsMatch);
        if(passwordsMatch){
          console.log(user[0]);
          return {
            id: user[0].id, // Ensure this is a number
            name: user[0].name,
            email: user[0].email as string,
            image: user[0].image,
            emailVerified: user[0].emailVerified ?? null,
          } as any;
        }else{
          return null;
        }
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  basePath:'/api/auth',
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (pathname === "/middleware-example") return !!auth
      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.email = user.email as string;
        token.name = user.name ?? null;
        token.image = user.image ?? null;
        token.emailVerified = user.emailVerified ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name ?? null;
        session.user.image = token.image ?? null;
        session.user.emailVerified = token.emailVerified ?? null;
      }
      return session;
    },
  },
  experimental: {
    enableWebAuthn: true,
  },
  debug: process.env.NODE_ENV !== "production" ? true : false,
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)


declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      emailVerified?: Date | null;
    } & DefaultSession["user"]
  }
  interface User {
    emailVerified?: Date | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    emailVerified?: Date | null;
  }
}
