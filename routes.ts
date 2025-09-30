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
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/management";
export const storeRoute = "/store";
