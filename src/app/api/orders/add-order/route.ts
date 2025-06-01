import { NextRequest, NextResponse } from "next/server";
import { ordersFeature } from "@/features/orders";
import { notificationFeature } from "@/features/notification";
import { checkoutFeature } from "@/features/checkout";

export async function POST(req: NextRequest) {
  try {
    //fsadf
    const order = await req.json();
    const swishStatus = await checkoutFeature.service.checkSwishPaymentStatus(
      order.requestId
    );
    if (!order || swishStatus !== "PAID") {
      return NextResponse.json(
        { message: "Invalid or unpaid order" },
        { status: 400 }
      );
    }
    // Save the order
    const result = await ordersFeature.service.createOrder(order);
    if (!result) {
      return NextResponse.json(
        { message: "Failed to save order to database" },
        { status: 500 }
      );
    }
    // ✅ Send confirmation email to customer
    await notificationFeature.service.sendOrderConfirmationEmail({
      to: order.email,
      name: order.firstName,
      orderId: result.orderId || "N/A",
      order: order,
      total: order.total,
    });

    return NextResponse.json(
      { message: "Order saved and email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: "Server error saving order" },
      { status: 500 }
    );
  }
}
