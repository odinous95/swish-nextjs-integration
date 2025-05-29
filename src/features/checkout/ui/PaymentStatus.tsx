import { Loader } from "@/global-ui";
import { FaCheckCircle } from "react-icons/fa";

import Image from "next/image";
import React from "react";

interface PaymentStatusProps {
    paymentStatus: string | null;
    qrCodeUrl: string | null;
}

export function PaymentStatus({ paymentStatus, qrCodeUrl }: PaymentStatusProps) {
    return (
        <div
            className={`min-h-screen flex flex-col items-center justify-center bg-white p-6 border-4 rounded-xl
${paymentStatus === "PAID"
                    ? "border-green-500"
                    : paymentStatus === "CREATED"
                        ? "border-gray-400"
                        : "border-red-500"
                }`}
        >
            <h1 className="text-xl font-bold mb-4 text-gray-500">Skanna QR-koden med Swish</h1>
            <Image
                src={qrCodeUrl ?? ""}
                alt="Swish QR-kod"
                width={256}
                height={256}
                className="w-64 h-64 mb-6"
            />
            {paymentStatus === "PAID" ? (
                <>
                    <p className="text-green-600 font-semibold">Betalningen är slutförd!</p>
                    <FaCheckCircle className="text-green-600 w-8 h-8 mt-4" />
                </>
            ) : paymentStatus === "CREATED" ? (
                <>
                    <Loader />
                    <p className="text-gray-500 font-semibold">Betalningen är under behandling.</p>
                </>
            ) : (
                <p className="text-red-600 font-semibold">Betalningen misslyckades. Försök igen.</p>
            )}
        </div>
    )

}