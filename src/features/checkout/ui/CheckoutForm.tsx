"use client";
import { useActionState, useEffect, useState } from "react";
import { submitCheckoutFormAction } from "../actions/index";
import { InputField } from "@/global-ui/form-reuseble/InputField";
import { AlertMessage } from "@/global-ui/form-reuseble/AlertMessage";
import { SubmitButton } from "@/global-ui/form-reuseble/SubmitButton";
import { CheckoutState } from "../types";
import { SelectField } from "@/global-ui/form-reuseble/SelectField";
import { useCartStore } from '@/store';
import { ErrorText, OrderSummary, PaymentMethod, PaymentStatus } from ".";

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
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

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
                try {
                    const res = await fetch(`/api/swish/paymentstatus?requestId=${state.swishId}`);
                    const data = await res.json();
                    setPaymentStatus(data.status || null);
                } catch (error) {
                    console.error("Failed to fetch payment status:", error);
                }
            }
        };

        fetchPaymentStatus();
    }, [state]);


    useEffect(() => {
        if (state.success && deviceType === "mobile" && state.swishUrl) {
            // Auto-open Swish app on mobile
            window.location.href = state.swishUrl;
        }
    }, [state.success, state.swishUrl, deviceType]);

    console.log("CheckoutForm state:", state);


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
        const discount = discountApplied ? subtotal * 0.1 : 0;
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

    if (qrCodeUrl && state.swishId && state.values) {
        const order = {
            firstName: state.values.firstName,
            lastName: state.values.lastName,
            email: state.values.email,
            phone: state.values.phone,
            address: state.values.address,
            postalCode: state.values.postalCode,
            city: state.values.city,
            comment: state.values.comment || "",
            floor: state.values.floor || "",
            doorCode: state.values.doorCode || "",
            deliveryDate: state.values.deliveryDate,
            cartItems, // From store
            total: calculateTotals().total,
            deviceType: state.values.deviceType,
            campaignCode: state.values.campaignCode || "",
            discount: state.values.discount || 0,
            discountApplied: state.values.discountApplied || false,
        };

        return (
            <PaymentStatus
                requestId={state.swishId}
                qrCodeUrl={qrCodeUrl}
                status={paymentStatus}
                order={order} // 👈 Now we can pass it cleanly
            />
        );
    }

    return (
        <form
            action={formAction}
            className="bg-white p-2 rounded-xl shadow-md max-w-2xl mx-auto space-y-4"
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
            {deviceType === "mobile" && state.swishUrl && (
                <a href={state.swishUrl} className="block text-center mt-4 text-blue-600 underline">
                    Klicka här om Swish inte öppnas automatiskt
                </a>
            )}
        </form>
    );
}
