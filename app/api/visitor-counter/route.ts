import { NextRequest, NextResponse } from 'next/server';
import { getVisitorCount, incrementVisitorCount, isVisitorStoreConfigured } from '@/lib/visitorStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const COOKIE_NAME = 'NexaNextVisitorCounted';

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

function isHttps(request: NextRequest): boolean {
  const forwarded = request.headers.get('x-forwarded-proto');
  if (forwarded) return forwarded.split(',')[0].trim().toLowerCase() === 'https';
  return request.nextUrl.protocol === 'https:';
}

export async function GET(request: NextRequest) {
  try {
    const configured = isVisitorStoreConfigured();
    const today = todayUtc();
    const alreadyCounted = request.cookies.get(COOKIE_NAME)?.value === today;
    const count = alreadyCounted ? await getVisitorCount() : await incrementVisitorCount();

    const response = NextResponse.json({
      ok: true,
      count,
      configured,
      storage: configured ? 'upstash-redis' : 'seed-fallback'
    });

    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');

    if (!alreadyCounted && configured) {
      response.cookies.set({
        name: COOKIE_NAME,
        value: today,
        httpOnly: true,
        secure: isHttps(request),
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 2
      });
    }

    return response;
  } catch (error) {
    console.error('nexaSMC visitor counter failed:', error);
    return NextResponse.json(
      { ok: false, count: 0, configured: isVisitorStoreConfigured() },
      { status: 500 }
    );
  }
}
