// // export { auth as middleware } from "@/auth"

// import { NextRequest, NextResponse } from "next/server";
// import { auth } from "./auth";

// export const middleware = async (req: NextRequest) => {
//     const { pathname } = req.nextUrl;
//     const session = await auth();

//     const isPublicAsset = pathname.startsWith("/google.svg") || pathname.startsWith("/public/");
//     if (isPublicAsset) {
//       return NextResponse.next();
//     }

//     if (!session && pathname !== "/sign-in" && pathname !== "/sign-up") {
//         const newUrl = new URL("/sign-in", req.nextUrl.origin);
//         return NextResponse.redirect(newUrl);
//     }

//     if (session && (pathname === "/sign-in" || pathname === "/sign-up")) {
//         const newUrl = new URL("/", req.nextUrl.origin);
//         return NextResponse.redirect(newUrl);
//     }

//     return NextResponse.next();
// }

// export const config = {
//     matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
//     runtime: "nodejs",
// };



// middleware.ts
import { NextRequest, NextResponse } from "next/server";

/**
 * Lightweight public path check.
 * Keep this list small & explicit — pages here will NOT be redirected to sign-in.
 */
const PUBLIC_PATHS = [
  "/",              // landing
  "/mission",       // mission info page
  "/resources",
  "/institute",
  "/l_employers",
  "/sign-in",
  "/sign-up",
];

function isPublic(pathname: string) {
  if (!pathname) return true;
  // allow next internals and static files
  if (pathname.startsWith("/_next") || pathname.startsWith("/static") || pathname.startsWith("/favicon.ico")) return true;
  // allow files in public folder by prefix
  if (pathname.startsWith("/public/")) return true;
  // exact or nested public paths
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export const middleware = async (req: NextRequest) => {
  const { pathname } = req.nextUrl;

  // 1) Always allow public paths quickly (no heavy imports)
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // 2) Allow obvious public asset patterns (images, icons)
  const isPublicAsset = pathname.startsWith("/google.svg") || pathname.startsWith("/robots.txt");
  if (isPublicAsset) {
    return NextResponse.next();
  }

  // 3) For protected routes, lazily import auth (so heavy modules are not loaded for public pages)
  //    This helps avoid bundling Prisma / DB code into middleware.
  let session = null;
  try {
    const authModule = await import("./auth");
    if (typeof authModule.auth === "function") {
      session = await authModule.auth();
    }
  } catch (err) {
    // If auth import fails, treat as unauthenticated and redirect to sign-in
    console.error("middleware: failed to import auth()", err);
    session = null;
  }

  // 4) Redirect logic
  if (!session && pathname !== "/sign-in" && pathname !== "/sign-up") {
    const signInUrl = new URL("/sign-in", req.nextUrl.origin);
    // optional: preserve original path so user can be redirected back after login
    signInUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (session && (pathname === "/sign-in" || pathname === "/sign-up")) {
    // user already signed in — send to root/dashboard
    const home = new URL("/", req.nextUrl.origin);
    return NextResponse.redirect(home);
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  runtime: "nodejs",
};
