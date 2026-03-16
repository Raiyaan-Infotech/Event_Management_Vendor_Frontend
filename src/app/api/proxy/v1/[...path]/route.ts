import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

async function forwardRequest(request: NextRequest, path: string, method: string) {
  try {
    const strippedPath = path.startsWith('v1/') ? path.slice(3) : path;
    const searchParams = request.nextUrl.search;
    const backendUrl = `${BACKEND_URL}/${strippedPath}${searchParams}`;

    let body: BodyInit | undefined;
    try {
      if (method !== 'GET' && method !== 'HEAD') {
        const contentType = request.headers.get('content-type') || '';
        if (contentType.includes('multipart/form-data')) {
          const formData = await request.formData();
          const targetFormData = new FormData();
          formData.forEach((value, key) => {
            targetFormData.append(key, value);
          });
          body = targetFormData;
        } else {
          body = await request.arrayBuffer();
        }
      }
    } catch {
      body = undefined;
    }

    const headers = new Headers(request.headers);
    headers.delete('host');
    headers.delete('connection');
    headers.delete('content-length');

    const isMultipart = headers.get('content-type')?.includes('multipart/form-data');
    if (isMultipart) {
      headers.delete('content-type');
    }

    // Explicitly rebuild Cookie header — Next.js may not include it in request.headers
    const allCookies = request.cookies.getAll();
    if (allCookies.length > 0) {
      headers.set('cookie', allCookies.map(c => `${c.name}=${c.value}`).join('; '));
    }

    const fetchOptions: RequestInit & { duplex?: string } = {
      method,
      headers,
      body: body || undefined,
      credentials: 'include',
    };

    if (body) {
      fetchOptions.duplex = 'half';
    }

    const backendResponse = await fetch(backendUrl, fetchOptions);

    console.log(`[Proxy] Forwarding ${method} to ${backendUrl}`);
    console.log(`[Proxy] Headers:`, Object.fromEntries(headers.entries()));

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

    const responseData = await backendResponse.arrayBuffer();

    if (backendResponse.status >= 400) {
      const errorText = new TextDecoder().decode(responseData);
      console.error(`[Backend Error ${backendResponse.status}]`, errorText);
      try {
        const errorJson = JSON.parse(errorText);
        return NextResponse.json(errorJson, { status: backendResponse.status });
      } catch {
        return NextResponse.json(
          { success: false, message: errorText || backendResponse.statusText },
          { status: backendResponse.status }
        );
      }
    }

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
