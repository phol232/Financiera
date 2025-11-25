import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/login', '/register', '/validate-payment', '/privacy-policy', '/delete-account'];
  const { pathname } = request.nextUrl;

  console.log('🔍 Middleware - Pathname:', pathname);

  // Si es una ruta pública, permitir acceso
  if (publicRoutes.includes(pathname)) {
    console.log('✅ Ruta pública detectada:', pathname);
    return NextResponse.next();
  }

  console.log('🔒 Ruta protegida:', pathname);
  // Para rutas protegidas, el AuthGuard se encargará de la redirección
  // Este middleware solo permite pasar
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

