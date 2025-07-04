import { ORDER } from "@/features/orders/types";
import { stripe } from "@/services/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, total_price, email } = body;
    // Validate input
    if (
      typeof total_price !== "number" ||
      total_price <= 0 ||
      typeof email !== "string" ||
      !email.includes("@")
    ) {
      return NextResponse.json(
        { error: "Invalid or missing required fields (total_price, email)" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "sek",
            product_data: {
              name: "Healthy Eating",
            },
            unit_amount: Math.round(total_price * 100),
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

    // console.log("[Stripe Session Created]", session);

    // Return session URL and paymentIntentId
    return NextResponse.json({
      url: session.url,
      payment_status: session.payment_status,
    });
  } catch (error) {
    console.error("[Stripe Error]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
