import { NextRequest, NextResponse } from "next/server";
import { ordersFeature } from "@/features/orders";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Missing order ID" },
        { status: 400 }
      );
    }

    const order = await ordersFeature.service.getOrderById(Number(id));

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { message: "Server error fetching order" },
      { status: 500 }
    );
  }
}
