"use client";
import { useEffect, useState, useRef } from "react";
import { useCartStore } from "@/store";
import { Loader } from "@/global-ui";
import { FaCheckCircle } from "react-icons/fa";
import Link from "next/link";
import { ORDER } from "@/features/orders/types";

interface PaymentStatusProps {
    swishUrlMobile: string | null;
    status: string | null;
    order: ORDER;
}

export function MobilePaymentStatus({ swishUrlMobile, status, order }: PaymentStatusProps) {
    // console.log(order, "order in PaymentStatus");
    const [paymentStatus, setPaymentStatus] = useState(status);
    const [orderCreated, setOrderCreated] = useState(false);
    const resetCart = useCartStore((state) => state.resetCart);
    const hasCreatedOrder = useRef(false); // Prevent multiple order creations
    // Poll for payment status
    useEffect(() => {
        let interval: NodeJS.Timeout;
        const fetchStatus = async () => {
            try {
                const res = await fetch(`/api/swish/paymentstatus/?requestId=${order.requestId}`);
                const data = await res.json();
                if (data.status) {
                    setPaymentStatus((prevStatus) => {
                        if (data.status === "PAID" && prevStatus !== "PAID") {
                            localStorage.removeItem("cart-storage");
                        }
                        return data.status;
                    });
                    if (["PAID", "FAILED"].includes(data.status)) {
                        clearInterval(interval);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch payment status", error);
            }
        };


        fetchStatus();
        interval = setInterval(fetchStatus, 3000);
        return () => clearInterval(interval);
    }, [order.requestId]);

    // Create order once when payment is successful
    useEffect(() => {
        const createOrder = async () => {
            try {
                const res = await fetch("/api/orders/add-order", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...order,
                        paymentStatus,
                    }),
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    console.error("Order creation failed:", errorText);
                } else {
                    setOrderCreated(true);
                    hasCreatedOrder.current = true;
                }
            } catch (error) {
                console.error("Error creating order:", error);
            }
        };

        if (paymentStatus === "PAID" && !hasCreatedOrder.current) {
            resetCart();
            localStorage.removeItem("cart-storage");
            hasCreatedOrder.current = true; // Mark before async to avoid race condition
            createOrder();
        }
    }, [paymentStatus, order, resetCart]);



    // Show loader while waiting for payment status
    if (paymentStatus === null) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
                <Loader />
                <p className="text-gray-500 font-semibold mt-4">Hämtar betalningsstatus...</p>

            </div>
        );
    }


    const borderColor =
        paymentStatus === "PAID"
            ? "border-green-500"
            : paymentStatus === "CREATED"
                ? "border-gray-400"
                : paymentStatus === "FAILED"
                    ? "border-red-500"
                    : "border-yellow-300";

    return (
        <div
            className={`min-h-screen flex flex-col items-center justify-center bg-white p-6 border-4 rounded-xl ${borderColor}`}
        >
            {paymentStatus === "PAID" ? (
                <>
                    <p className="text-green-600 font-semibold">Betalningen är slutförd!</p>
                    <FaCheckCircle className="text-green-600 w-8 h-8 mt-4" />
                    <Link
                        href="/"
                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                        Till startsidan.
                    </Link>
                </>
            ) : paymentStatus === "CREATED" ? (
                <>
                    <Loader />
                </>
            ) : paymentStatus === "FAILED" ? (
                <p className="text-red-600 font-semibold">Betalningen misslyckades. Försök igen.</p>
            ) : (
                <p className="text-yellow-600 font-semibold">Okänd betalningsstatus. Vänta eller försök igen.</p>
            )}
            {
                order.deviceType === "mobile" && swishUrlMobile && (
                    <a href={swishUrlMobile} className="block text-center mt-4 text-blue-600 underline">
                        Klicka här om Swish inte öppnas automatiskt
                    </a>
                )
            }
        </div>
    );
}
