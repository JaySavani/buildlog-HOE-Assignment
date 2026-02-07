// auth.config.edge.ts
import type { NextAuthConfig } from "next-auth";

export const authConfigEdge = {
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      const protectedRoutes = ["/submit", "/my-projects"];
      const adminRoutes = ["/admin"];
      const authRoutes = ["/sign-in", "/sign-up"];

      const isProtectedRoute = protectedRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
      );
      const isAuthRoute = authRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
      );
      const isAdminRoute = adminRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
      );

      if (!isLoggedIn && (isProtectedRoute || isAdminRoute)) {
        return false;
      }

      if (isLoggedIn && isAuthRoute) {
        return Response.redirect(new URL("/", nextUrl));
      }

      if (isLoggedIn && isAdminRoute) {
        if (auth?.user?.role === "ADMIN") {
          return true;
        }
        return Response.redirect(new URL("/", nextUrl));
      }

      return true;
    },
  },
  providers: [], // Providers go in the main auth.ts, not here
} satisfies NextAuthConfig;
