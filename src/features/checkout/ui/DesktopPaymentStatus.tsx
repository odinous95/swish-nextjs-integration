"use client";

import React, { useEffect, useState } from "react";
import { useCartStore } from "@/store";
import { Loader } from "@/global-ui";
import { FaCheckCircle } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

interface PaymentStatusProps {
  qrCodeUrl: string | null;
  status: string | null;
  requestId?: string;
}

export function DesktopPaymentStatus({
  qrCodeUrl,
  status,
  requestId,
}: PaymentStatusProps) {
  const [paymentStatus, setPaymentStatus] = useState<string | null>(status);
  const resetCart = useCartStore((s) => s.resetCart);

  useEffect(() => {
    if (!requestId) return;
    let iv: number;
    const fetchStatus = async () => {
      try {
        const res = await fetch(
          `/api/swish/paymentstatus/?requestId=${requestId}`
        );
        const data = await res.json();
        if (data.status) {
          setPaymentStatus((prev) => {
            if (data.status === "PAID" && prev !== "PAID") {
              localStorage.removeItem("cart-storage");
              resetCart();
            }
            return data.status;
          });
          if (["PAID", "FAILED"].includes(data.status)) {
            clearInterval(iv);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchStatus();
    iv = window.setInterval(fetchStatus, 3000);
    return () => clearInterval(iv);
  }, [requestId, resetCart]);

  // Loader innan status är känd
  if (paymentStatus === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        <Loader />
        <p className="text-gray-500 font-semibold mt-4">
          Hämtar betalningsstatus...
        </p>
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
      {paymentStatus === "CREATED" && (
        <>
          <h2 className="text-xl font-bold mb-4 text-gray-700 text-center">
            Skanna QR-koden med Swish
          </h2>
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
        </>
      )}

      {paymentStatus === "PAID" ? (
        <>
          {/* Mycket större check-ikon överst */}
          <FaCheckCircle className="text-green-600 w-20 h-20 mb-4" />

          {/* Gradient-rubrik centrerad */}
          <h1 className="text-center text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            Tack för din beställning!
          </h1>

          {/* Mindre text direkt under rubriken */}
          <p className="mt-2 text-base text-gray-800 text-center">
            Betalning är slutförd! Du kommer få en bekräftelse via mejl.
          </p>

          {/* Till startsidan-knapp */}
          <Link
            href="/"
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Till startsidan
          </Link>
        </>
      ) : paymentStatus === "FAILED" ? (
        <p className="text-red-600 font-semibold">
          Betalningen misslyckades. Försök igen.
        </p>
      ) : paymentStatus === "CREATED" ? null : (
        <p className="text-yellow-600 font-semibold">
          Okänd betalningsstatus. Vänta eller försök igen.
        </p>
      )}
    </div>
  );
}
