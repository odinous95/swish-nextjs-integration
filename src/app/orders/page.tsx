import OrdersTable from "@/features/orders/ui/OrderTable";
import React from "react";

type Order = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    postal_code: string;
    city: string;
    comment: string | null;
    door_code: string;
    floor: string;
    extra_comment: string | null;
    delivery_date: string; // ISO string
    payment_method: string;
    swish_id: string | null;
    swish_url: string | null;
    qr_code_url: string | null;
    payment_status: string | null;
    total_price: string;
    discount: string;
    delivery_fee: string;
    discount_applied: boolean;
    campaign_code: string;
    terms_accepted: boolean;
    created_at: string; // ISO string
    delivery_time_window: string;
};

const ORDERS_PER_PAGE = 20;

async function fetchOrders(): Promise<Order[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/get-orders`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch orders");
    const data = await res.json();
    return data.orders;
}

export default async function OrdersPage() {
    let orders: Order[] = [];

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
