import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Sadece static dosyalar için middleware'i atla
  const { pathname } = request.nextUrl
  
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || 
      pathname.endsWith('.ico') || pathname.endsWith('.png') || 
      pathname.endsWith('.jpg') || pathname.endsWith('.svg')) {
    return NextResponse.next()
  }

  // Diğer tüm sayfalara erişime izin ver - auth kontrolleri client-side yapılacak
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
