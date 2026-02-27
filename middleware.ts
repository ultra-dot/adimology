import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');

  // Ngambil settingan dari environment variable (.env)
  const user = process.env.BASIC_AUTH_USER;
  const pwd = process.env.BASIC_AUTH_PASSWORD;

  // Cek apakah user udah masukin kredensial
  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [providedUser, providedPwd] = atob(authValue).split(':');

    // Cocokin username dan password
    if (providedUser === user && providedPwd === pwd) {
      return NextResponse.next();
    }
  }

  // Kalau gagal atau belum login, tembak respon 401 dan munculin popup browser
  return new NextResponse('Akses Ditolak. Masukkan Username dan Password.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Adimology Secure Area"',
    },
  });
}

// Atur middleware ini biar jalan di semua halaman web lo
// (Kecuali file gambar, css, js bawaan Next.js biar gak error)
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
