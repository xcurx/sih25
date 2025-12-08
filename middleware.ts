import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

const PUBLIC_PATHS = [
  "/",
  "/mission",
  "/resources",
  "/institutes",
  "/l_employers",
  "/register-company",
];

function isPublic(pathname: string) {
  if (!pathname) return true;
  if (pathname.startsWith("/google.svg") || pathname.startsWith("/public/") || pathname.startsWith("/_next/")) return true;
  return PUBLIC_PATHS.some((p) => pathname === p);
}

export const middleware = async (req: NextRequest) => {
    const { pathname } = req.nextUrl;
    const session = await auth();

    if (isPublic(pathname)) {
      return NextResponse.next();
    }

    if (!session && pathname !== "/sign-in" && pathname !== "/sign-up") {
        const newUrl = new URL("/sign-in", req.nextUrl.origin);
        return NextResponse.redirect(newUrl);
    }

    if (session && (pathname === "/sign-in" || pathname === "/sign-up")) {
        const newUrl = new URL("/", req.nextUrl.origin);
        return NextResponse.redirect(newUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$|.*\\.webp$).*)"],
    runtime: "nodejs",
};
