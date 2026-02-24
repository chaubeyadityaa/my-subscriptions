// src/types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }

  interface User {
    // extend user if needed
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}