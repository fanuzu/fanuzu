import { NextResponse } from 'next/server';
import { submitPreregistration, type PreregRequestBody } from '@/lib/prereg';

export const runtime = 'nodejs';

function clientIp(request: Request): string {
  // Vercel (and most reverse proxies) set x-forwarded-for to
  // "client, proxy1, proxy2" — the first entry is the original client.
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

export async function POST(request: Request) {
  let body: PreregRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'server_error', message: 'Malformed request body.' }, { status: 400 });
  }

  try {
    const result = await submitPreregistration(body, clientIp(request));
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (err) {
    console.error('prereg submission failed:', err);
    return NextResponse.json(
      { success: false, error: 'server_error', message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
