import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const user = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  const isLoginPage = pathname === "/login";

  if (!user && !isLoginPage) {
    const url = new URL("/login", request.url);
    if (pathname !== "/") url.searchParams.set("from", pathname + search);
    return NextResponse.redirect(url);
  }

  if (user && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Everything except Next internals and static files.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
