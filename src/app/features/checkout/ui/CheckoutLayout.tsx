// components/checkout/CheckoutLayout.tsx
"use client";

import { useCheckoutLogic } from "@/hooks/useCheckoutLogic";
import CheckoutForm from "./CheckoutForm";
import QrFallbackView from "./QrFallbackView";
import SuccessView from "./SuccessView";
import { Navbar } from "@/global-ui";

export default function CheckoutLayout() {
    const { paymentSuccess, showQrFallback, qrBlobUrl } = useCheckoutLogic();

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            {paymentSuccess ? (
                <SuccessView />
            ) : showQrFallback && qrBlobUrl ? (
                <QrFallbackView blobUrl={qrBlobUrl} />
            ) : (
                <CheckoutForm />
            )}
        </div>
    );
}
