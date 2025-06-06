"use client";
import { useActionState, useEffect, useState } from "react";
import { submitCheckoutFormAction } from "../actions/index";
import { InputField } from "@/global-ui/form-reuseble/InputField";
import { AlertMessage } from "@/global-ui/form-reuseble/AlertMessage";
import { SubmitButton } from "@/global-ui/form-reuseble/SubmitButton";
import { CheckoutState } from "../types";
import { SelectField } from "@/global-ui/form-reuseble/SelectField";
import { useCartStore } from '@/store';
import { DesktopPaymentStatus, ErrorText, MobilePaymentStatus, OrderSummary } from ".";
import { Note } from "@/global-ui";
import { generateDeliveryOptions } from "@/utils/calculateDate";
import Image from "next/image";

const intialPayload = {
    firstName: "",
    lastName: "",
    address: "",
    postalCode: "",
    city: "",
    phone: "",
    email: "",
    extra_comment: "",
    doorCode: "",
    floor: "",
    deliveryDate: "",
    termsAccepted: false,
    deviceType: "",
    campaignCode: "",
    discountApplied: false,
    paymentMethod: "",
    totalPrice: 0,
    deliveryFee: 0,
}

export function CheckoutForm() {
    const [state, formAction, isPending] = useActionState<CheckoutState, FormData>(
        submitCheckoutFormAction,
        {
            success: false,
            intialSate: intialPayload,
            status: null,
            message: null,
            errors: {},
        }
    );
    // console.log("CheckoutForm state:", state);
    const [deviceType, setDeviceType] = useState("");
    const cartItems = useCartStore((state) => state.cartItems);
    const [showCampaignCode, setShowCampaignCode] = useState(false);
    const [campaignCode, setCampaignCode] = useState("");
    const [campaignError, setCampaignError] = useState<string | null>(null);
    const [discountApplied, setDiscountApplied] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [swishUrlMobile, setSwishUrlMobile] = useState<string | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
    const [he59Available, setHe59Available] = useState<boolean>(true);

    // Set device type based on user agent
    useEffect(() => {
        const userAgent = typeof window !== "undefined" ? navigator.userAgent : "";
        const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
        setDeviceType(isMobile ? "mobile" : "desktop");
    }, []);

    useEffect(() => {
        if (state.success && deviceType === "desktop" && state.qrCodeUrl && state.swishId) {
            setQrCodeUrl(state.qrCodeUrl);
        }
    }, [state.success, state.qrCodeUrl, state.swishId, deviceType]);

    useEffect(() => {
        if (state.success && deviceType === "mobile" && state.swishUrl) {
            setSwishUrlMobile(state.swishUrl);
            window.location.href = state.swishUrl;
        }
    }, [state.success, state.swishUrl, state.swishId, deviceType]);

    useEffect(() => {
        const usedCount = Number(localStorage.getItem("he59_used_count") || "0");
        setHe59Available(usedCount < 10);
    }, []);

    const formattedDeliveryOptions = generateDeliveryOptions();
    const Betalningsmetod = [
        { label: "Swish", value: "swish", },
        { label: "Klarna", value: "klarna", },
    ];
    // Helper to count non-extra items (matlådor)
    const getNonExtraQuantity = () =>
        cartItems.filter(item => !item.isExtra).reduce((acc, item) => acc + item.quantity, 0);

    const calculateTotals = () => {
        const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const nonExtraQuantity = getNonExtraQuantity();
        let discount = 0;
        // Only apply HE59 if available, code entered, and <= 5 matlådor
        if (
            discountApplied &&
            campaignCode.toLowerCase() === "he59" &&
            he59Available &&
            nonExtraQuantity > 0 &&
            nonExtraQuantity <= 5
        ) {
            discount = subtotal * 0.2;
        }
        // Free shipping if non-extra quantity > 5
        const shippingFee = nonExtraQuantity >= 5 ? 0 : 19;
        const tax = subtotal * 0.12;
        const total = subtotal + shippingFee + tax - discount;
        return { subtotal, shippingFee, tax, discount, total };
    };
    // Enhanced coupon validation
    const validateCoupon = () => {
        const nonExtraQuantity = getNonExtraQuantity();
        const usedCount = Number(localStorage.getItem("he59_used_count") || "0");
        if (campaignCode.toLowerCase() === "he59") {
            if (usedCount >= 10 || nonExtraQuantity > 5) {
                setDiscountApplied(false);
                setCampaignError("Koden har löpt ut");
            } else {
                setDiscountApplied(true);
                setCampaignError(null);
            }
        } else {
            setDiscountApplied(false);
            setCampaignError("Ogiltig kampanjkod");
        }
    };

    const handleCampaignCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCampaignCode(e.target.value);
        setCampaignError(null);
    };

    const getOrderObject = () => {
        const [deliveryDate, deliveryTimeWindow] = (state.values?.deliveryDate ?? "").split("|");
        return {
            firstName: state.values?.firstName,
            lastName: state.values?.lastName,
            email: state.values?.email,
            phone: state.values?.phone,
            address: state.values?.address,
            postalCode: state.values?.postalCode,
            city: state.values?.city,
            extra_comment: state.values?.extra_comment || "",
            floor: state.values?.floor || "",
            doorCode: state.values?.doorCode || "",
            deliveryDate,
            deliveryTimeWindow,
            cartItems,
            total: calculateTotals().total,
            deviceType: deviceType,
            campaignCode,
            discount: state.values.discount || 0,
            paymentMethod: state.values?.paymentMethod,
            termsAccepted: state.values?.termsAccepted ?? false,
            discountApplied,
            requestId: state.swishId ?? undefined,
        };
    };


    if (qrCodeUrl && state.values?.deviceType === "desktop" && state.swishId) {
        return <DesktopPaymentStatus qrCodeUrl={qrCodeUrl} status={paymentStatus} order={getOrderObject()} />;
    }
    if (swishUrlMobile && state.values?.deviceType === "mobile" && state.swishId) {
        return <MobilePaymentStatus swishUrlMobile={swishUrlMobile} status={paymentStatus} order={getOrderObject()} />;
    }

    return (
        <form
            action={formAction}
            className="bg-white p-2 rounded-xl shadow-md max-w-2xl mx-auto space-y-4"
        >
            <h2 className="text-xl font-semibold text-yellow-500">Leveransuppgifter</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <InputField id="firstName" name="firstName" label="Förnamn*" type="text" disabled={isPending} defaultValue={state.values?.firstName} />
                    <ErrorText error={state.errors?.firstName} />
                </div>
                <div>
                    <InputField id="lastName" name="lastName" label="Efternamn*" type="text" disabled={isPending} defaultValue={state.values?.lastName} />
                    <ErrorText error={state.errors?.lastName} />
                </div>
            </div>

            <InputField id="address" name="address" label="Adress*" type="text" disabled={isPending} defaultValue={state.values?.address} />
            <ErrorText error={state.errors?.address} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <InputField id="postalCode" name="postalCode" label="Postnummer*" type="text" disabled={isPending} defaultValue={state.values?.postalCode} />
                    <ErrorText error={state.errors?.postalCode} />
                </div>
                <div>
                    <InputField id="city" name="city" label="Ort*" type="text" disabled={isPending} defaultValue={state.values?.city} />
                    <ErrorText error={state.errors?.city} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <InputField id="phone" name="phone" label="Telefonnummer*" type="tel" disabled={isPending} defaultValue={state.values?.phone} />
                    <ErrorText error={state.errors?.phone} />
                </div>
                <div>
                    <InputField id="email" name="email" label="E-post*" type="email" disabled={isPending} defaultValue={state.values?.email} />
                    <ErrorText error={state.errors?.email} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <InputField id="doorCode" name="doorCode" label="Portkod" type="text" disabled={isPending} defaultValue={state.values?.doorCode} />
                </div>
                <div>
                    <InputField id="floor" name="floor" label="Våningsplan" type="text" disabled={isPending} defaultValue={state.values?.floor} />
                </div>
            </div>

            <textarea
                id="extra_comment"
                name="extra_comment"
                rows={3}
                className="peer relative z-1 w-full pt-4 pb-2 pl-4 font-light bg-transparent border border-gray-100 dark:border-gray-600 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed text-black 
            focus:border-orange-500 focus:ring-1 focus:ring-orange-200"
                placeholder="Dina kommentarer, till exempel allergier, speciella önskemål eller andra instruktioner."
                disabled={isPending}
                defaultValue={state.values?.extra_comment}
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
            <Note text={"Om du lägger din beställning efter kl. 20.00, kommer nästa tillgängliga leveransdag att vara från och med dagen efter i morgon. För att få leverans redan nästa dag, behöver beställningen läggas senast kl. 20.00 dagen innan."} />
            <SelectField
                id="deliveryDate"
                name="deliveryDate"
                label="Leveransdatum"
                options={[{ label: "Välj leveransdatum...", value: "" }, ...formattedDeliveryOptions]}
                disabled={isPending}
                defaultValue={state.values?.deliveryDate}
            />
            <ErrorText error={state.errors?.deliveryDate} />

            <div className="px-2 flex flex-row gap-x-2 items-center">
                <Image
                    src="/Assets/swish.png"
                    alt="Swish"
                    width={20}
                    height={20}
                />
                <Image
                    src="/Assets/klarna.png"
                    alt="Swish"
                    width={60}
                    height={60}
                />
            </div>
            <SelectField
                id="paymentMethod"
                name="paymentMethod"
                label="Betalningsmetod"
                options={[{ label: "Välj Betalningsmetod...", value: "" }, ...Betalningsmetod]}
                disabled={isPending}
                defaultValue={state.values?.paymentMethod}
            />
            <ErrorText error={state.errors?.paymentMethod} />

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
                    defaultChecked={state.values?.termsAccepted}
                />
                <label htmlFor="termsAccepted" className="ml-2 block text-sm text-gray-700">
                    Jag godkänner villkoren
                </label>
            </div>
            <ErrorText error={state.errors?.termsAccepted} />

            {state.message && <AlertMessage state={state} />}
            <SubmitButton
                disabled={isPending || cartItems.length === 0}
                pending={isPending}
                title="Slutför och betala"
            />
            {cartItems.length === 0 && (
                <p className="text-red-600 font-semibold">
                    Din varukorg är tom. Lägg till produkter innan du slutför beställningen.
                </p>
            )}
        </form>

    );
}
