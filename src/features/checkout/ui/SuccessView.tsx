// components/checkout/SuccessView.tsx
"use client";

import { useEffect } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";

export function SuccessView() {
  const router = useRouter();

  useEffect(() => {
    // Kör konfetti så fort confetti-skriptet är inläst
    if (typeof window !== "undefined" && typeof (window as any).confetti === "function") {
      (window as any).confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.3 },
      });
    }
  }, []);

  return (
    <>
      {/* Ladda confetti-biblioteket från CDN */}
      <Script
        src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"
        strategy="afterInteractive"
      />

      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        {/* Huvudrubrik */}
        <h1 className="text-4xl font-extrabold text-green-600 mb-4 text-center">
          🎉 Tack för din beställning! 🎉
        </h1>

        {/* Underrubrik */}
        <p className="text-lg text-gray-700 mb-8 text-center">
          Betalning slutförd — du kommer få en bekräftelse via mejl inom kort.
        </p>

        {/* Knapp tillbaka */}
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
        >
          Till startsidan
        </button>
      </div>
    </>
  );
}
