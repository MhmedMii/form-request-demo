import { NextResponse } from 'next/server';
export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      error: 'demo_only',
      message: 'This demo submits fictional requests in the browser only.',
    },
    { status: 410 },
  );
}
