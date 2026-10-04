import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh/check the Supabase session.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  const isAdminRoute =
    pathname === "/admin" || pathname.startsWith("/admin/");

  const isAdminLogin = pathname === "/admin/login";

  // /admin/login
  if (isAdminLogin) {
    // Already an admin → go directly to Control Center.
    if (user?.app_metadata?.role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return response;
  }

  // Everything under /admin requires authentication.
  if (isAdminRoute) {
    // Not logged in → admin login.
    if (!user) {
      return NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
    }

    // Logged in but not an admin → sign out and redirect.
    if (user.app_metadata?.role !== "admin") {
      await supabase.auth.signOut();

      return NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};