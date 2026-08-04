import { NextResponse } from 'next/server';
import { submitPreregistration, type PreregRequestBody } from '@/lib/prereg';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let body: PreregRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'invalid_json', message: 'Malformed request body.' }, { status: 400 });
  }

  try {
    const result = await submitPreregistration(body);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (err) {
    console.error('prereg submission failed:', err);
    return NextResponse.json(
      { success: false, error: 'internal_error', message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
