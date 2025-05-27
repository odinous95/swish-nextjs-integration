import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Get token from query parameters
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  const qrRequestBody = {
    token,
    size: "600",
    format: "png",
    border: "0",
  };

  try {
    const swishRes = await fetch(
      "https://mpc.getswish.net/qrg-swish/api/v1/commerce",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(qrRequestBody),
      }
    );

    if (!swishRes.ok) {
      return NextResponse.json(
        { error: `Swish QR failed: ${swishRes.statusText}` },
        { status: swishRes.status }
      );
    }

    const arrayBuffer = await swishRes.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
