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
            id: Number(user[0].id), // Ensure this is a number
            name: user[0].name,
            email: user[0].email as string,
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
        token.user = {
          id: user.id ? Number(user.id) : 0,
          name: user.name,
          email: user.email as string,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = {
          id: token.user.id !== undefined ? Number(token.user.id) : 0,
          name: token.user.name ?? null,
          email: token.user.email as string,
        };
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
  interface Session {
    accessToken?: string;
    user: {
      id: number;
      name?: string | null;
      email?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    user: {
      id: number ;
      name?: string | null;
      email?: string;
    };
  }
}
