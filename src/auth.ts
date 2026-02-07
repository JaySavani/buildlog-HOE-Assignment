import NextAuth from "next-auth";

import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "@/lib/db";

import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as "USER" | "ADMIN";
      }

      return session;
    },
    async jwt({ token, user }) {
      if (!token.sub) return token;

      if (user) {
        token.role = user.role;
        return token;
      }

      if (token.role) return token;

      const existingUser = await prisma.user.findUnique({
        where: { id: token.sub },
      });

      if (!existingUser) return token;

      token.role = existingUser.role;
      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  trustHost: true,
  ...authConfig,
});
