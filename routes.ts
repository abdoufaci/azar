export const publicRoutes = [
  "/",
  "/auth/new-verification",
  "/ar/store",
  "/fr/store",
  "/ar/store/*",
  "/fr/store/*",
];
export const protectedRoutes = [
  "/ar/management",
  "/fr/management",
  "/ar/management/*",
  "/fr/management/*",
];

export const authRoutes = [
  "/ar/auth/login",
  "/ar/auth/register",
  "/ar/auth/error",
  "/ar/auth/reset",
  "/ar/auth/new-password",
  "/fr/auth/login",
  "/fr/auth/register",
  "/fr/auth/error",
  "/fr/auth/reset",
  "/fr/auth/new-password",
];

export const apiAuthPrefix = "/api";

export const DEFAULT_LOGIN_REDIRECT = "/";
export const storeRoute = "/store";
