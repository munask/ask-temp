import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/register']

/**
 * Route-to-resource mapping for permission-based route protection.
 * When a route is mapped to a resource + action, the middleware checks
 * if the user's role (stored in a cookie) is authorized.
 *
 * NOTE: Full permission checking happens client-side via usePermissions hook.
 * This middleware provides a first-pass server-side guard using the user's
 * primary role. For granular resource-action checks, rely on the client-side
 * PermissionGuard component and usePermissions hook.
 */
const ROUTE_PERMISSIONS: Record<string, { resource: string; action: string }> = {
  '/settings': { resource: 'settings', action: 'read' },
  '/data': { resource: 'data', action: 'read' },
  '/data-report': { resource: 'data-report', action: 'read' },
  '/showcase': { resource: 'showcase', action: 'read' },
}

/**
 * Simplified role-to-route access for middleware.
 * This is a server-side approximation — the client handles fine-grained permissions.
 * Key: role ID, Value: array of allowed route prefixes.
 */
const ROLE_ROUTE_ACCESS: Record<string, string[]> = {
  admin: ['*'], // admin can access everything
  editor: ['/', '/profile', '/settings', '/data', '/data-report', '/showcase'],
  viewer: ['/', '/profile', '/settings', '/data', '/data-report', '/showcase'],
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('accessToken')?.value
  const userRole = request.cookies.get('userRole')?.value || ''

  // Check if route is public (no auth required)
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route))

  // If user has token and tries to access auth pages, redirect to home
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If user doesn't have token and tries to access protected routes, redirect to login
  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Optional: server-side role-based route protection
  // This checks if the user's role has access to the current route prefix
  if (token && userRole && !isPublicRoute) {
    const allowedRoutes = ROLE_ROUTE_ACCESS[userRole]
    if (allowedRoutes && !allowedRoutes.includes('*')) {
      const hasAccess = allowedRoutes.some(route => {
        if (route === '/') return pathname === '/'
        return pathname.startsWith(route)
      })
      if (!hasAccess) {
        // Redirect to home if role doesn't have access to this route
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ]
}
