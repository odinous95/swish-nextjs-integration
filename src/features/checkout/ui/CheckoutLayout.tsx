// components/checkout/CheckoutLayout.tsx
"use client";
import { useCheckoutLogic } from "@/hooks/useCheckoutLogic";
import SuccessView from "./SuccessView";
import QrFallbackView from "./QrFallbackView";
import { CheckoutForm } from "./CheckoutForm";


export default function CheckoutLayout() {
    const { paymentSuccess, showQrFallback, qrBlobUrl } = useCheckoutLogic();

    return (
        <div className="min-h-screen bg-gray-50">

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
