import { NextResponse } from 'next/server';
import { submitPreregistration, type PreregRequestBody } from '@/lib/prereg';
import { clientIp } from '@/lib/request-ip';

export const runtime = 'nodejs';

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
