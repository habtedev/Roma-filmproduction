import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("roma_refresh_token")?.value;
  const isLoginPage = request.nextUrl.pathname.startsWith("/admin/login");
  const isAdminPage = request.nextUrl.pathname.startsWith("/admin") && !isLoginPage;

  if (isAdminPage && !token) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && token) {
    const adminUrl = new URL("/admin", request.url);
    return NextResponse.redirect(adminUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
