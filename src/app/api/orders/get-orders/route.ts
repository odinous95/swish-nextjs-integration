import { NextRequest, NextResponse } from "next/server";
import { ordersFeature } from "@/features/orders";

export async function GET(req: NextRequest) {
  try {
    const orders = await ordersFeature.service.getAllOrders();
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Server error fetching orders" },
      { status: 500 }
    );
  }
}
