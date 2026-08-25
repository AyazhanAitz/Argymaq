import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { locales, defaultLocale } from "@/i18n/config";

const SESSION_COOKIE = "ao_admin_session";

async function isValidAdminSession(token: string | undefined): Promise<boolean> {
  if (!token || !process.env.SESSION_SECRET) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.SESSION_SECRET));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Защита админ-панели и приватных admin API (обращения, документы) на
  // уровне edge middleware, в дополнение к проверке в layout/route handler —
  // п.38 ТЗ: обращения и документы не должны быть доступны без аутентификации.
  const isProtectedAdminRoute =
    (pathname.startsWith("/admin") && pathname !== "/admin/login") || pathname.startsWith("/api/admin");

  if (isProtectedAdminRoute) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const valid = await isValidAdminSession(token);
    if (!valid) {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return NextResponse.next();

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasLocale) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|uploads|ornament|robots.txt|sitemap.xml).*)",
  ],
};
