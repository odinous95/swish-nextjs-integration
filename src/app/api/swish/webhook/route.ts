// src/app/api/swish/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Log the incoming payment callback
    console.log("✅ Swish Webhook Received:", body);
    console.log("Payment Reference:", body);

    // You can do things like:
    // - validate paymentReference
    // - update order/payment status in your DB
    // - notify user/admin

    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  } catch (err) {
    console.error("❌ Webhook handler error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
