import { NextRequest, NextResponse } from 'next/server';

const LOCAL_BACKEND = 'http://localhost:5000/api';
const CLOUD_BACKEND =
  process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes('localhost:5000')
    ? process.env.NEXT_PUBLIC_API_URL
    : 'https://e-commerce-backend-4c4d.onrender.com/api';

async function handleProxy(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const subPath = (path || []).join('/');
  const search = req.nextUrl.search || '';
  const method = req.method;

  const forwardHeaders: Record<string, string> = {
    'Content-Type': req.headers.get('content-type') || 'application/json',
  };

  const authHeader = req.headers.get('authorization');
  if (authHeader) forwardHeaders['Authorization'] = authHeader;

  const guestId = req.headers.get('x-guest-id');
  if (guestId) forwardHeaders['x-guest-id'] = guestId;

  const cookieHeader = req.headers.get('cookie');
  if (cookieHeader) forwardHeaders['Cookie'] = cookieHeader;

  let bodyText: string | undefined;
  if (method !== 'GET' && method !== 'HEAD') {
    try {
      bodyText = await req.text();
    } catch {
      bodyText = undefined;
    }
  }

  // 1. Try Local Backend (http://localhost:5000/api) if running locally
  try {
    const localUrl = `${LOCAL_BACKEND}/${subPath}${search}`;
    const res = await fetch(localUrl, {
      method,
      headers: forwardHeaders,
      body: bodyText,
      signal: AbortSignal.timeout(900),
      cache: 'no-store',
    });

    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('content-type') || 'application/json',
      },
    });
  } catch {
    // Local port 5000 is not running; proceed to live Cloud Backend
  }

  // 2. Forward to Live Cloud Backend (https://e-commerce-backend-4c4d.onrender.com/api)
  try {
    const cloudUrl = `${CLOUD_BACKEND}/${subPath}${search}`;
    const res = await fetch(cloudUrl, {
      method,
      headers: forwardHeaders,
      body: bodyText,
      signal: AbortSignal.timeout(30000),
      cache: 'no-store',
    });

    const data = await res.text();
    return new NextResponse(data, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('content-type') || 'application/json',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        data: [],
        message: error?.message || 'Failed to connect to backend API',
      },
      { status: 502 }
    );
  }
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, ctx);
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, ctx);
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, ctx);
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, ctx);
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, ctx);
}
