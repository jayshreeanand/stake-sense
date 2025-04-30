import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const path = url.pathname

  // Redirect /dashboard to /app for consistency
  if (path === '/dashboard') {
    url.pathname = '/app'
    return NextResponse.redirect(url)
  }

  // If it's the root path and there's a redirect to dashboard, prevent it
  if (path === '/' && url.searchParams.get('redirect') === 'dashboard') {
    url.searchParams.delete('redirect')
    return NextResponse.redirect(url)
  }

  // For all other paths, proceed normally
  return NextResponse.next()
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match specific paths:
     * - / (root path)
     * - /dashboard (to redirect to /app)
     * - /app
     * But exclude:
     * - /api (API routes)
     * - /_next (Next.js internals)
     * - /static (inside /public)
     * - all files inside /public
     */
    '/',
    '/dashboard',
    '/app',
  ],
} 