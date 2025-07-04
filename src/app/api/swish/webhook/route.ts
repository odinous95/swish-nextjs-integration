// src/app/api/swish/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ordersFeature } from "@/features/orders";
import { notificationFeature } from "@/features/notification";
import { ORDER } from "@/features/orders/types";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("✅ Swish Webhook Received:", body);

    const { status, message } = body;
    console.log("Swish Webhook Status:", status);
    console.log("Swish Webhook Message:", message);

    // Extract orderId from Swish `message`
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid message in payload" },
        { status: 400 }
      );
    }

    const orderId = parseInt(message.split(" ")[0], 10);
    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: "Invalid order ID in message" },
        { status: 400 }
      );
    }

    const result = await ordersFeature.service.getOrderById(orderId);
    if (!result.success || !result.order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    const order = result.order;

    // Only update if not already marked as paid
    if (status === "PAID" && order?.payment_status !== "paid") {
      await ordersFeature.service.updateOrderPaymentStatus(order?.id, "paid");
      // // ✅ Send confirmation email to customer
      await notificationFeature.service.sendOrderConfirmationEmail({
        to: order.email,
        name: order.first_name,
        orderId: order?.id || "N/A",
        order: {
          ...order,
          cart_items: JSON.parse(order.cart_items),
        } as ORDER,
        total_price: Number(order.total_price),
      });

      console.log(`✅ Order ${order.id} marked as PAID`);
    } else if (status === "FAILED") {
      await ordersFeature.service.updateOrderPaymentStatus(order?.id, "failed");

      console.log(`❌ Order ${order.id} marked as FAILED`);
    }

    return NextResponse.json({ message: "Webhook processed" }, { status: 200 });
  } catch (err) {
    console.error("❌ Webhook handler error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
