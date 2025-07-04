// src/app/api/stripe/webhook/route.ts
import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/services/stripe";
import { ordersFeature } from "@/features/orders";
import { notificationFeature } from "@/features/notification";
import { ORDER } from "@/features/orders/types";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const endpointSecret = process.env.STRIPE_SECRET_WEBHOOK_KEY!;
  const sig = (await headers()).get("stripe-signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error("❌ Stripe signature verification failed:", err);
    return new Response(JSON.stringify({ error: "Invalid signature" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const eventType = event.type;
  console.log("✅ Stripe Webhook Event:", eventType);

  // We only care about successful payments
  if (
    eventType !== "checkout.session.completed" &&
    eventType !== "checkout.session.async_payment_succeeded"
  ) {
    return new Response(null, { status: 200 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  const orderId = parseInt(session.metadata?.orderId ?? "", 10);
  if (!orderId || isNaN(orderId)) {
    console.error("❌ Missing or invalid orderId in Stripe metadata");
    return new Response(
      JSON.stringify({ error: "Invalid orderId in metadata" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const result = await ordersFeature.service.getOrderById(orderId);
  if (!result.success || !result.order) {
    return new Response(JSON.stringify({ error: "Order not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const order = result.order;

  if (session.payment_status === "paid" && order.payment_status !== "paid") {
    await ordersFeature.service.updateOrderPaymentStatus(orderId, "paid");

    await notificationFeature.service.sendOrderConfirmationEmail({
      to: order.email,
      name: order.first_name,
      orderId: order.id,
      order: {
        ...order,
        cart_items: JSON.parse(order.cart_items),
      } as ORDER,
      total_price: Number(order.total_price),
    });

    console.log(`✅ Order ${orderId} marked as PAID`);
  }

  return new Response(JSON.stringify({ message: "Processed Stripe webhook" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
