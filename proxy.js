// Proxy middleware para Next.js
// En modo mock, este middleware maneja la autenticación simulada
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Si el usuario está autenticado y en la página de login, redirigir a inicio
    if (token && pathname === "/") {
      const url = req.nextUrl.clone();
      url.pathname = "/inicio";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Permitir acceso a rutas públicas sin autenticación
        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/" ||
          pathname.startsWith("/tracking") || // Página pública de tracking de envíos
          pathname.includes(".")
        ) {
          return true;
        }

        return !!token;
      },
    },
    pages: {
      signIn: "/",
    },
  }
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|assets|favicon.ico|global.css).*)"],
};
