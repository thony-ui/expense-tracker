import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/middleware";
import { createClient } from "./lib/supabase/supabase-server";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  const protectedRoutes = [
    "/",
    "/dashboard",
    "/transactions",
    "/analytics",
    "/categories",
    "/settings",
  ];
  const publicRoutes = ["/auth/signin", "/auth/signup"];

  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // Redirect to /auth/signin if the user is not authenticated and trying to access a protected route
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/signin";
    return NextResponse.redirect(url);
  }

  // Redirect to / if the user is authenticated and trying to access a public route
  if (isPublicRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
