import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*", "/signup", "/login", "/verifyId"],
};

export const middleware = async (request: NextRequest) => {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  if (
    token &&
    (url.pathname.startsWith("/signup") ||
      url.pathname.startsWith("/login") ||
      url.pathname.startsWith("/verify"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", url));
  }

  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", url));
  }

  return NextResponse.next();
};
