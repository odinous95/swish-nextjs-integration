// app/api/swish-qr/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token } = await req.json();
  console.log("Swish QR token:", token);
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  // 2) Proxy the request to Swish
  const swishRes = await fetch(
    "https://mpc.getswish.net/qrg-swish/api/v1/commerce",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, format: "png", size: 300 }),
    }
  );

  if (!swishRes.ok) {
    return NextResponse.json(
      { error: `Swish QR failed: ${swishRes.statusText}` },
      { status: swishRes.status }
    );
  }

  // 3) Read binary and send back as image/png
  const arrayBuffer = await swishRes.arrayBuffer();
  const uint8 = new Uint8Array(arrayBuffer);

  return new NextResponse(uint8, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=60",
    },
  });
}

export function GET() {
  // Disallow GET
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
