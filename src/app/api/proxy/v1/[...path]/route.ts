import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const PROXY_TIMEOUT_MS = 25000;

async function forwardRequest(request: NextRequest, path: string, method: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), PROXY_TIMEOUT_MS);

  try {
    const strippedPath = path.startsWith('v1/') ? path.slice(3) : path;
    const searchParams = request.nextUrl.search;
    const backendUrl = `${BACKEND_URL}/${strippedPath}${searchParams}`;

    // Forward the raw body as a Blob to ensure no re-encoding happens
    let body: BodyInit | undefined;
    if (method !== 'GET' && method !== 'HEAD') {
      body = await request.blob();
    }

    const headers = new Headers(request.headers);
    headers.delete('host');
    headers.delete('connection');
    headers.delete('content-length');


    // Explicitly rebuild Cookie header — Next.js may not include it in request.headers
    const allCookies = request.cookies.getAll();
    if (allCookies.length > 0) {
      headers.set('cookie', allCookies.map(c => `${c.name}=${c.value}`).join('; '));
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
      body,
      credentials: 'include',
      cache: 'no-store',
      signal: controller.signal,
    };

    const backendResponse = await fetch(backendUrl, fetchOptions);

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Proxy] Forwarding ${method} to ${backendUrl}`);
    }

    const responseHeaders = new Headers();
    backendResponse.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (!['content-encoding', 'content-length', 'transfer-encoding', 'connection', 'set-cookie'].includes(lowerKey)) {
        responseHeaders.append(key, value);
      }
    });

    const setCookieHeaders = backendResponse.headers.getSetCookie?.();
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      setCookieHeaders.forEach(cookie => {
        responseHeaders.append('Set-Cookie', cookie);
      });
    }

    const responseData = await backendResponse.blob();

    return new NextResponse(responseData, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('[API Proxy Error]', error);
    return NextResponse.json(
      { success: false, message: 'Proxy request failed: Backend unreachable or timed out' },
      { status: 504 }
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: pathArray } = await params;
  return forwardRequest(request, pathArray.join('/'), 'GET');
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: pathArray } = await params;
  return forwardRequest(request, pathArray.join('/'), 'POST');
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: pathArray } = await params;
  return forwardRequest(request, pathArray.join('/'), 'PUT');
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: pathArray } = await params;
  return forwardRequest(request, pathArray.join('/'), 'PATCH');
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: pathArray } = await params;
  return forwardRequest(request, pathArray.join('/'), 'DELETE');
}
