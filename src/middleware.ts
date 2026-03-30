import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const adminCookie = request.cookies.get("admin_session")?.value;
  
  // Proteksi semua rute /admin kecuali halaman login /admin/login
  if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/admin/login")) {
    if (!adminCookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    
    try {
      const parsed = await decrypt(adminCookie);
      if (!parsed?.isAdmin) {
        throw new Error("Invalid token payload");
      }
    } catch (e) {
      // Jika token expired atau dimanipulasi, tendang balik ke login
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Jangan tampilkan halaman otentikasi jika user sudah login
  if (request.nextUrl.pathname.startsWith("/admin/login") && adminCookie) {
    try {
       await decrypt(adminCookie);
       return NextResponse.redirect(new URL("/admin", request.url));
    } catch {}
  }
  
  return NextResponse.next();
}

// Hanya jalankan middleware ini pada url yang berawalan /admin
export const config = {
  matcher: "/admin/:path*",
};
