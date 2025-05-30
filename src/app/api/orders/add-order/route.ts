import { NextRequest, NextResponse } from "next/server";
import { ordersFeature } from "@/features/orders";

export async function POST(req: NextRequest) {
  try {
    const order = await req.json();

    if (!order || order.paymentStatus !== "PAID") {
      return NextResponse.json(
        { message: "Invalid or unpaid order" },
        { status: 400 }
      );
    }

    const result = await ordersFeature.service.createOrder(order);
    console.log("Order created:", result);
    if (!result) {
      return NextResponse.json(
        { message: "Failed to save order to database" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Order saved to database successfully" },
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
