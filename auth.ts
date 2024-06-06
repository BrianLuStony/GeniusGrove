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
import { getUser } from "./db"

const storage = createStorage({
  driver: process.env.VERCEL
    ? vercelKVDriver({
        url: process.env.AUTH_KV_REST_API_URL,
        token: process.env.AUTH_KV_REST_API_TOKEN,
        env: false,
      })
    : memoryDriver(),
})

const config = {
  theme: { logo: "https://authjs.dev/img/logo-sm.png" },
  adapter: UnstorageAdapter(storage),
  session: {
    strategy: 'jwt',
  },
  jwt: { encode, decode },
  providers: [
    GitHub,
    Google,
    Credentials({
      name: "Sign in",
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
        // const passwordsMatch = await compare(password, user[0].password!);
        // if (!passwordsMatch) {
        //   console.error("Invalid password for user:", email);
        //   return null;
        // }
        if(password == user[0].password){
          console.log(user[0]);
          return user[0] as any;
        }else{
          return null;
        }
        // let user = await getUser(credentials.email);
        // if (user.length === 0) return null;
        // let passwordsMatch = await compare(credentials.password, user[0].password!);
        // if (passwordsMatch) return user[0] as any;
      },
    }),
  ],
  basePath: "/auth",
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (pathname === "/middleware-example") return !!auth
      return true
    },
    jwt({ token, trigger, session, account }) {
      if (trigger === "update") token.name = session.user.name
      if (account?.provider === "keycloak") {
        return { ...token, accessToken: account.access_token }
      }
      return token
    },
    async session({ session, token }) {
      if (token?.accessToken) {
        session.accessToken = token.accessToken
      }
      return session
    },
  },
  experimental: {
    enableWebAuthn: true,
  },
  debug: process.env.NODE_ENV !== "production" ? true : false,
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)

declare module "next-auth" {
  interface Session {
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
  }
}
