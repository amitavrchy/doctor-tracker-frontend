import { NextResponse, type NextRequest } from "next/server";
/* The /api rewrite makes the cookie first-party. This presence check is only
 * optimistic; /auth/me and backend routes verify the session and role. The
 * browser Origin is forwarded and must be included in backend CLIENT_URL. */

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasCookie = Boolean(request.cookies.get("token")?.value);
  if (pathname === "/")
    return NextResponse.redirect(
      new URL(hasCookie ? "/dashboard" : "/login", request.url),
    );
  if (pathname === "/login") {
    if (hasCookie && request.nextUrl.searchParams.get("expired") !== "1")
      return NextResponse.redirect(new URL("/dashboard", request.url));
    return NextResponse.next();
  }
  if (!hasCookie) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api(?:/|$)|_next/static|_next/image|(?:favicon\\.ico|icon\\.svg|apple-icon\\.png)$).*)",
  ],
};
