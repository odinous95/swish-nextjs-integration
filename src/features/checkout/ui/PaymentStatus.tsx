"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store";
import { Loader } from "@/global-ui";
import { FaCheckCircle } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { ORDER } from "@/features/orders/types";

interface PaymentStatusProps {
    requestId: string | undefined;
    qrCodeUrl: string | null;
    status: string | null;
    order: ORDER; // Use a proper Order type if you have one
}

export function PaymentStatus({ requestId, qrCodeUrl, status, order }: PaymentStatusProps) {
    const [paymentStatus, setPaymentStatus] = useState(status);
    const [orderCreated, setOrderCreated] = useState(false);
    const resetCart = useCartStore((state) => state.resetCart);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        const fetchStatus = async () => {
            try {
                const res = await fetch(`/api/swish/paymentstatus/?requestId=${requestId}`);
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
    }, [requestId]);

    useEffect(() => {
        const createOrder = async () => {
            try {
                const res = await fetch("/api/orders", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...order,
                        paymentStatus, // 👈 Add payment status to the payload
                    }),
                });
                if (!res.ok) {
                    const errorText = await res.text();
                    console.error("Order creation failed:", errorText);
                } else {
                    setOrderCreated(true);
                }
            } catch (error) {
                console.error("Error creating order:", error);
            }
        };

        if (paymentStatus === "PAID" && !orderCreated) {
            resetCart();
            localStorage.removeItem("cart-storage");
            createOrder();
        }
    }, [paymentStatus, order, orderCreated, resetCart]);


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
            <h1 className="text-xl font-bold mb-4 text-gray-500">Skanna QR-koden med Swish</h1>

            {qrCodeUrl ? (
                <Image
                    src={qrCodeUrl}
                    alt="Swish QR-kod"
                    width={256}
                    height={256}
                    className="w-64 h-64 mb-6"
                />
            ) : (
                <div className="w-64 h-64 mb-6 bg-gray-100 flex items-center justify-center rounded">
                    <Loader />
                </div>
            )}

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
                    <p className="text-gray-500 font-semibold">Betalningen är under behandling.</p>
                </>
            ) : paymentStatus === "FAILED" ? (
                <p className="text-red-600 font-semibold">Betalningen misslyckades. Försök igen.</p>
            ) : (
                <p className="text-yellow-600 font-semibold">Okänd betalningsstatus. Vänta eller försök igen.</p>
            )}
        </div>
    );
}
