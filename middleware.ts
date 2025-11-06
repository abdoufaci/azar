import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  protectedRoutes,
  publicRoutes,
} from "./routes";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

export const { auth } = NextAuth(authConfig);

let locales = ["fr", "ar"];
let defaultLocale = "fr";

function getLocale(request: any) {
  const normalizedHeaders = Object.fromEntries(request.headers);
  let languages = new Negotiator({ headers: normalizedHeaders }).languages();

  if (languages.length === 1 && languages[0] === "*") return defaultLocale;
  return match(languages, locales, defaultLocale);
}

export default auth(
  //@ts-ignore
  (request) => {
    const { pathname } = request.nextUrl;

    const isApiAuthRoute = request.nextUrl.pathname.startsWith(apiAuthPrefix);
    if (isApiAuthRoute) {
      return null;
    }
    const pathnameHasLocale = locales.some(
      (locale) =>
        pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    const locale = getLocale(request);
    if (!pathnameHasLocale && !isApiAuthRoute) {
      request.nextUrl.pathname = `/${locale}${pathname}`;
    }

    const isLoggedIn = !!request.auth;

    const isProtectedRoutes = protectedRoutes.includes(
      request.nextUrl.pathname
    );
    const isAuthRoute = authRoutes.includes(request.nextUrl.pathname);

    if (isAuthRoute) {
      if (isLoggedIn) {
        return Response.redirect(
          new URL(DEFAULT_LOGIN_REDIRECT, request.nextUrl)
        );
      }
      return pathnameHasLocale ? null : NextResponse.redirect(request.nextUrl);
    }

    if (!isLoggedIn && isProtectedRoutes) {
      return Response.redirect(new URL("/auth/login", request.nextUrl));
    }

    return pathnameHasLocale ? null : NextResponse.redirect(request.nextUrl);
  }
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
