// src/app/api/stripe/create-klarna-session/route.ts

import { stripe } from "@/services/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, total_price, email } = body;

    // ✅ Validate input
    if (
      typeof orderId !== "number" ||
      typeof total_price !== "number" ||
      total_price <= 0 ||
      typeof email !== "string" ||
      !email.includes("@")
    ) {
      return NextResponse.json(
        { error: "Invalid or missing fields: orderId, total_price, email" },
        { status: 400 }
      );
    }

    // ✅ Create Klarna Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["klarna"],
      mode: "payment",
      customer_email: email,
      locale: "sv", // Klarna requires supported locale (sv, en, etc.)
      line_items: [
        {
          price_data: {
            currency: "sek",
            product_data: {
              name: "Healthy Eating",
            },
            unit_amount: Math.round(total_price * 100), // Stripe expects amount in öre
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId: orderId.toString(),
      },
      success_url: `${req.nextUrl.origin}/stripe-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/checkout`,
    });

    return NextResponse.json({
      url: session.url,
      payment_status: session.payment_status,
    });
  } catch (error) {
    console.error("❌ Klarna Session Error:", error);
    return NextResponse.json(
      { error: "Failed to create Klarna session" },
      { status: 500 }
    );
  }
}
