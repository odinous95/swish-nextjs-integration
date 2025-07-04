"use client";

import React, { useEffect, useRef, useState } from "react";
import { useCartStore } from "@/store";

interface StripePaymentSuccessProps {
    payment_status?: string;
}

export function StripePaymentSuccess({ payment_status }: StripePaymentSuccessProps) {
    const [paymentStatus, setPaymentStatus] = useState<string | null>(payment_status || null);
    const resetCart = useCartStore((s) => s.resetCart);
    useEffect(() => {
        if (paymentStatus !== "paid") return;
        resetCart();
        localStorage.removeItem("cart-storage");
    }, [paymentStatus, resetCart]);

    return (
        <span className="text-green-600 text-lg font-semibold">
            {paymentStatus}
        </span>
    );
}

