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
import { getUser, createUser , getOrCreateOAuthUser,linkAccount } from "./db"
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
    async signIn({ user, account, profile }) {
      if (account && profile) {
        console.log("OAuth Sign In:", { user, account, profile }); // Add this for debugging
        const dbUser = await getOrCreateOAuthUser(
          profile.name ?? '',
          profile.email ?? '',
          account.provider,
          profile.image as string
        );
        if (dbUser) {
          console.log("DB User created/retrieved:", dbUser); // Add this for debugging
          await linkAccount(
            dbUser.id,
            account.provider,
            account.providerAccountId,
            account
          );
          user.id = dbUser.id.toString();
        }
      }
      return true;
    },
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (pathname === "/middleware-example") return !!auth
      return true
    },
    jwt({ token, user ,account}) {
      
      if (user) {
        token.id = user.id as string;
        token.email = user.email as string;
        token.name = user.name ?? null;
        token.image = user.image ?? null;
        token.emailVerified = user.emailVerified ?? null;
      }
      if (account) {
        token.accessToken = account.access_token
      }
      return token;
    },
    async session({ session, token }) {

      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string | null
        session.user.image = token.image as string | null
        session.user.emailVerified = token.emailVerified as Date | null
        session.accessToken = token.accessToken as string
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
    accessToken?: string
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
    provider?: string;
    providerAccountId?: string;
    accessToken?: string;
  }
}
