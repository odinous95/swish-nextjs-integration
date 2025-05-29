"use client";
import { useActionState, useEffect, useState } from "react";
import { submitCheckoutFormAction } from "../actions/index";
import { InputField } from "@/global-ui/form-reuseble/InputField";
import { AlertMessage } from "@/global-ui/form-reuseble/AlertMessage";
import { SubmitButton } from "@/global-ui/form-reuseble/SubmitButton";
import { CheckoutState } from "../types";
import { SelectField } from "@/global-ui/form-reuseble/SelectField";
import { useCartStore } from '@/store';
import Image from "next/image";
import { ErrorText, OrderSummary, PaymentMethod, PaymentStatus } from ".";
import { checkoutFeature } from "../feature";
import { Loader } from "@/global-ui";

export function CheckoutForm() {
    const [state, formAction, isPending] = useActionState<CheckoutState, FormData>(
        submitCheckoutFormAction,
        {
            success: false,
            status: null,
            message: null,
            errors: {},
        }
    );
    const [selectedPayment, setSelectedPayment] = useState("swish");
    const [deviceType, setDeviceType] = useState("desktop");
    const cartItems = useCartStore((state) => state.cartItems);
    const [showCampaignCode, setShowCampaignCode] = useState(false);
    const [campaignCode, setCampaignCode] = useState("");
    const [campaignError, setCampaignError] = useState<string | null>(null);
    const [discountApplied, setDiscountApplied] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [pymentStatus, setPaymentStatus] = useState<string | null>(null);


    useEffect(() => {
        const userAgent = typeof window !== "undefined" ? navigator.userAgent : "";
        const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
        setDeviceType(isMobile ? "mobile" : "desktop");
    }, []);

    useEffect(() => {
        const fetchPaymentStatus = async () => {
            if (state.success && state.qrCodeUrl && state.swishId) {
                setQrCodeUrl(state.qrCodeUrl);
            }
            if (state.swishId) {
                const paymentStatus = await checkoutFeature.service.getPaymentStatus(state.swishId);
                setPaymentStatus(paymentStatus.data?.status || null)
            }
        };
        fetchPaymentStatus();
    }, [state]);

    const deliveryOptions = [
        { label: "Fredag 30/5 (08:00 – 13:00)", value: "Fredag 30/5 (08:00 – 13:00)" },
        { label: "Lördag 31/5 (16:00 – 20:00)", value: "Lördag 31/5 (16:00 – 20:00)" },
        { label: "Söndag 1/6 (16:00 – 20:00)", value: "Söndag 1/6 (16:00 – 20:00)" },
        { label: "Måndag 2/6 (08:00 – 13:00)", value: "Måndag 2/6 (08:00 – 13:00)" },
        { label: "Tisdag 3/6 (08:00 – 13:00)", value: "Tisdag 3/6 (08:00 – 13:00)" },
        { label: "Onsdag 4/6 (08:00 – 13:00)", value: "Onsdag 4/6 (08:00 – 13:00)" }
    ];

    const calculateTotals = () => {
        const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const discount = discountApplied ? subtotal * 0.1 : 0; // example 10% discount
        const shippingFee = 0;
        const tax = 0;
        const total = subtotal + shippingFee + tax - discount;
        return { subtotal, shippingFee, tax, discount, total };
    };

    const validateCoupon = () => {
        if (campaignCode.toLowerCase() === "rabatt10") {
            setDiscountApplied(true);
            setCampaignError(null);
        } else {
            setDiscountApplied(false);
            setCampaignError("Ogiltig kampanjkod");
        }
    };

    const handleCampaignCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCampaignCode(e.target.value);
        setCampaignError(null);
    };

    if (qrCodeUrl) {
        return (
            <div
                className={`min-h-screen flex flex-col items-center justify-center bg-white p-6 border-4 rounded-xl
    ${pymentStatus === "PAID"
                        ? "border-green-500"
                        : pymentStatus === "CREATED"
                            ? "border-gray-400"
                            : "border-red-500"
                    }
  `}
            >
                <h1 className="text-xl font-bold mb-4 text-gray-500">Skanna QR-koden med Swish</h1>

                <Image
                    src={qrCodeUrl}
                    alt="Swish QR-kod"
                    width={256}
                    height={256}
                    className="w-64 h-64 mb-6"
                />

                {pymentStatus === "PAID" ? (
                    <p className="text-green-600 font-semibold">Betalningen är slutförd!</p>
                ) : pymentStatus === "CREATED" ? (
                    <>
                        <Loader />
                        <p className="text-gray-500 font-semibold">Betalningen är under behandling.</p>
                    </>
                ) : (
                    <p className="text-red-600 font-semibold">Betalningen misslyckades. Försök igen.</p>
                )}
            </div>

        );
    }

    <PaymentStatus paymentStatus={pymentStatus} qrCodeUrl={qrCodeUrl} />

    return (
        <>
            <form
                action={formAction}
                className="bg-white p-4 rounded-xl shadow-md max-w-2xl mx-auto space-y-6"
            >
                <h2 className="text-xl font-semibold text-yellow-500">Leveransuppgifter</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <InputField id="firstName" name="firstName" label="Förnamn" type="text" disabled={isPending} />
                        <ErrorText error={state.errors?.firstName} />
                    </div>
                    <div>
                        <InputField id="lastName" name="lastName" label="Efternamn" type="text" disabled={isPending} />
                        <ErrorText error={state.errors?.lastName} />
                    </div>
                </div>
                <InputField id="address" name="address" label="Hem Adress" type="text" disabled={isPending} />
                <ErrorText error={state.errors?.address} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <InputField id="postalCode" name="postalCode" label="Postnummer" type="text" disabled={isPending} />
                        <ErrorText error={state.errors?.postalCode} />
                    </div>
                    <div>
                        <InputField id="city" name="city" label="Ort" type="text" disabled={isPending} />
                        <ErrorText error={state.errors?.city} />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <InputField id="phone" name="phone" label="Telefonnummer" type="tel" disabled={isPending} />
                        <ErrorText error={state.errors?.phone} />
                    </div>
                    <div>
                        <InputField id="email" name="email" label="E-post" type="email" disabled={isPending} />
                        <ErrorText error={state.errors?.email} />
                    </div>
                </div>
                <InputField id="comment" name="comment" label="Kommentar" type="text" disabled={isPending} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <InputField id="doorCode" name="doorCode" label="Portkod" type="text" disabled={isPending} />
                    </div>
                    <div>
                        <InputField id="floor" name="floor" label="Våningsplan" type="text" disabled={isPending} />
                    </div>
                </div>
                <textarea
                    id="extraComment"
                    name="extraComment"
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-gray-300 text-black shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm placeholder-gray-500 px-4 py-2"
                    placeholder="Dina kommentarer..."
                    disabled={isPending}
                />
                {/* Order Summary */}
                <OrderSummary
                    cartItems={cartItems}
                    showCampaignCode={showCampaignCode}
                    campaignCode={campaignCode}
                    campaignError={campaignError ?? ""}
                    discountApplied={discountApplied}
                    onCampaignCodeToggle={() => setShowCampaignCode(!showCampaignCode)}
                    onCampaignCodeChange={handleCampaignCodeChange}
                    onCampaignCodeBlur={validateCoupon}
                    onCampaignCodeKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            validateCoupon();
                        }
                    }}
                    getTotalPrice={calculateTotals}
                />
                <SelectField
                    id="deliveryDate"
                    name="deliveryDate"
                    label="Leveransdatum"
                    options={[{ label: "Välj leveransdatum...", value: "" }, ...deliveryOptions]}
                    disabled={isPending}
                />
                {/* Payment method selection */}
                <PaymentMethod
                    selectedPayment={selectedPayment}
                    onPaymentSelect={setSelectedPayment}
                />
                <input type="hidden" name="paymentMethod" value={selectedPayment} />
                <input type="hidden" name="campaignCode" value={campaignCode} />
                <input type="hidden" name="discountApplied" value={discountApplied.toString()} />
                <input type="hidden" name="totalPrice" value={calculateTotals().total.toFixed(2)} />
                <input type="hidden" name="deliveryFee" value={calculateTotals().shippingFee.toFixed(2)} />
                <input type="hidden" name="discount" value={calculateTotals().discount.toFixed(2)} />
                <input type="hidden" name="discountApplied" value={discountApplied.toString()} />
                <input type="hidden" name="deviceType" value={deviceType} />
                <div className="flex items-center mt-4">
                    <input
                        id="termsAccepted"
                        name="termsAccepted"
                        type="checkbox"
                        required
                        className="h-4 w-4 text-yellow-500 border-gray-300 rounded"
                        disabled={isPending}
                    />
                    <label htmlFor="termsAccepted" className="ml-2 block text-sm text-gray-700">
                        Jag godkänner villkoren
                    </label>
                </div>
                <ErrorText error={state.errors?.termsAccepted} />
                {state.message && <AlertMessage state={state} />}
                <SubmitButton disabled={isPending} pending={isPending} title="Slutför och betala" />
            </form>

        </>
    );
}
