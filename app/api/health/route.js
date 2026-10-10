import { NextResponse } from 'next/server';
export function GET() {
  return NextResponse.json({ ok: true, mode: 'fictional-demo', externalServices: false });
}
