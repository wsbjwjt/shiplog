import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 公开路由白名单
const publicPaths = [
  '/login',
  '/api/auth',
  '/_next',
  '/favicon.ico',
  '/',
];

export function middleware(request: NextRequest) {
  const { nextUrl } = request;

  // 检查是否为公开路径
  const isPublicPath = publicPaths.some(path =>
    nextUrl.pathname === path || nextUrl.pathname.startsWith(path + '/')
  );

  // API 路由处理
  if (nextUrl.pathname.startsWith('/api')) {
    // 公开 API 无需认证
    if (nextUrl.pathname.startsWith('/api/auth') ||
        nextUrl.pathname.startsWith('/api/public')) {
      return NextResponse.next();
    }
  }

  // 检查session cookie (Auth.js v5使用authjs.session-token)
  const sessionCookie = request.cookies.get('authjs.session-token') ||
                       request.cookies.get('__Secure-authjs.session-token');
  const isLoggedIn = !!sessionCookie;

  // 未登录用户访问受保护路由，重定向到登录页
  if (!isLoggedIn && !isPublicPath) {
    const loginUrl = new URL('/login', nextUrl);
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 已登录用户访问登录页，重定向到dashboard
  if (isLoggedIn && nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
