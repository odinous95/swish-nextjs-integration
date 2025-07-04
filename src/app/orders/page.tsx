
import { ORDER } from "@/features/orders/types";
import { OrdersTable } from "@/features/orders/ui";
import React from "react";


const ORDERS_PER_PAGE = 20;

async function fetchOrders(): Promise<ORDER[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/get-orders`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch orders");
    const data = await res.json();
    return data.orders;
}

export default async function OrdersPage() {
    let orders: ORDER[] = [];

    try {
        orders = await fetchOrders();
    } catch (error) {
        console.error("Failed to fetch orders:", error);
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-4xl font-bold mb-8 text-gray-900">Orders</h1>
            <OrdersTable initialOrders={orders.slice(0, ORDERS_PER_PAGE)} allOrders={orders} />
        </div>
    );
}
