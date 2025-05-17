// src/app/api/hello/route.ts
import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ ok: true, now: Date.now() });
}

// If you also want to handle POST for testing:
// export function POST() {
//   return NextResponse.json({ ok: true, now: Date.now() });
// }
