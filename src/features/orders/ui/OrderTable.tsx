"use client";

import React, { useState } from "react";

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
    delivery_date: string;
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
    created_at: string;
    delivery_time_window: string;
};

type Props = {
    initialOrders: Order[];
    allOrders: Order[];
};

const ORDERS_PER_PAGE = 20;

export function OrdersTable({ initialOrders, allOrders }: Props) {
    const [visibleCount, setVisibleCount] = useState(initialOrders.length);

    const showMore = () => {
        setVisibleCount((count) => Math.min(count + ORDERS_PER_PAGE, allOrders.length));
    };

    const visibleOrders = allOrders.slice(0, visibleCount);

    return (
        <>
            {visibleOrders.length === 0 ? (
                <p className="text-gray-600 text-lg">No orders found.</p>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-lg shadow border border-gray-300">
                        <table className="min-w-full divide-y divide-gray-200 bg-white">
                            <thead className="bg-gray-100">
                                <tr>
                                    {[
                                        "ID",
                                        "Name",
                                        "Email",
                                        "Phone",
                                        "Address",
                                        "City",
                                        "Delivery Date",
                                        "Payment Method",
                                        "Payment Status",
                                        "Total Price",
                                        "Created At",
                                    ].map((header) => (
                                        <th
                                            key={header}
                                            scope="col"
                                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {visibleOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-yellow-50">
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{order.id}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                                            {order.first_name} {order.last_name}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-blue-600 underline cursor-pointer">
                                            <a href={`mailto:${order.email}`}>{order.email}</a>
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{order.phone}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                                            {order.address}, {order.postal_code}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{order.city}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                                            {new Date(order.delivery_date).toLocaleDateString()} ({order.delivery_time_window})
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{order.payment_method}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                                            {order.payment_status || "N/A"}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm font-semibold text-gray-900">
                                            {parseFloat(order.total_price).toFixed(2)} SEK
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                                            {new Date(order.created_at).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {visibleCount < allOrders.length && (
                        <div className="flex justify-center mt-6">
                            <button
                                onClick={showMore}
                                className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-md shadow-md transition"
                            >
                                Show More Orders
                            </button>
                        </div>
                    )}
                </>
            )}
        </>
    );
}
