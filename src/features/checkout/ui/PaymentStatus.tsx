import { Loader } from "@/global-ui";
import { FaCheckCircle } from "react-icons/fa";
import Image from "next/image";
import React from "react";
import Link from "next/link";

interface PaymentStatusProps {
    paymentStatus: string | null | undefined;
    qrCodeUrl: string | null;
}

export function PaymentStatus({ paymentStatus, qrCodeUrl }: PaymentStatusProps) {
    // Handle null, undefined, or empty status
    const isLoading = !paymentStatus || paymentStatus === "";

    // Determine border color based on paymentStatus
    const borderColor = paymentStatus === "PAID"
        ? "border-green-500"
        : paymentStatus === "CREATED"
            ? "border-gray-400"
            : paymentStatus === "FAILED"
                ? "border-red-500"
                : "border-yellow-300"; // default for loading/unknown

    return (
        <div
            className={`min-h-screen flex flex-col items-center justify-center bg-white p-6 border-4 rounded-xl ${borderColor}`}
        >
            <h1 className="text-xl font-bold mb-4 text-gray-500">
                Skanna QR-koden med Swish
            </h1>

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

            {isLoading ? (
                <>
                    <Loader />
                    <p className="text-gray-500 font-semibold">Hämtar betalningsstatus...</p>
                </>
            ) : paymentStatus === "PAID" ? (
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
