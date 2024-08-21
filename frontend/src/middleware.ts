import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-slug', '/' + request.url.split('/').pop() || '');

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    }
  });
}