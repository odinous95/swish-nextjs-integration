// src/features/checkout/ui/CheckoutForm.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useActionState } from "react";
import { submitCheckoutFormAction } from "../actions/index";
import { CheckoutState } from "../types";
import { useCartStore } from "@/store";
import {
  DesktopPaymentStatus,
  MobilePaymentStatus,
  ErrorText,
} from ".";
import { AlertMessage } from "@/global-ui/form-reuseble/AlertMessage";
import { SubmitButton } from "@/global-ui/form-reuseble/SubmitButton";
import { generateDeliveryOptions } from "@/utils/calculateDate";
import {
  MapPin,
  User,
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  Truck,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import CheckoutSteps from "./CheckoutSteps";
import { VALID_POSTCODES } from "@/data";
import { getItemImage } from "@/utils/getItemImage";

export function CheckoutForm() {
  // Ref för att scrolla
  const formRef = useRef<HTMLFormElement>(null);
  // Cart & delivery
  const cartItems = useCartStore((s) => s.cartItems);
  const formattedDeliveryOptions = generateDeliveryOptions();
  // Form-state
  const [state, formAction, isPending] = useActionState<CheckoutState, FormData>(
    submitCheckoutFormAction,
    {
      success: false,
      status: null,
      message: null,
      errors: {},
      values: {
        first_name: "",
        last_name: "",
        address: "",
        postal_code: "",
        city: "",
        phone: "",
        email: "",
        extra_comment: "",
        door_code: "",
        floor: "",
        delivery_date: "",
        terms_accepted: false,
        device_type: "",
        campaign_code: "",
        discount_applied: false,
        payment_method: "",
        total_price: 0,
        delivery_fee: 0,
        cart_items: [],
      },
    }
  );


  // Steg‐state
  const [step, setStep] = useState(1);
  // Scrolla till toppen när steg ändras
  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step]);

  // Lokala input-värden
  const [values, setValues] = useState({
    first_name: state.values.first_name,
    last_name: state.values.last_name,
    address: state.values.address,
    postal_code: state.values.postal_code,
    city: state.values.city,
    door_code: state.values.door_code,
    floor: state.values.floor,
    phone: state.values.phone,
    email: state.values.email,
    extra_comment: state.values.extra_comment,
  });

  // Synka initialt
  useEffect(() => {
    setValues({
      first_name: state.values.first_name,
      last_name: state.values.last_name,
      address: state.values.address,
      postal_code: state.values.postal_code,
      city: state.values.city,
      door_code: state.values.door_code,
      floor: state.values.floor,
      phone: state.values.phone,
      email: state.values.email,
      extra_comment: state.values.extra_comment,
    });
  }, [state.values]);

  // Postnummervalidering
  const [showPostalCodeError, setShowPostalCodeError] = useState(false);
  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const normalized = raw.replace(/\s+/g, "");
    setShowPostalCodeError(!VALID_POSTCODES.has(normalized));
    setValues(v => ({ ...v, postal_code: raw }));
  };

  // STEG 1-validering
  const step1IsValid =
    Boolean(values.first_name?.trim()) &&
    Boolean(values.last_name?.trim()) &&
    Boolean(values.address?.trim()) &&
    Boolean(values.postal_code?.trim()) &&
    Boolean(values.city?.trim()) &&
    Boolean(values.phone?.trim()) &&
    Boolean(values.email?.trim()) &&
    !showPostalCodeError;

  // Hoppa tillbaka vid servervalideringsfel
  useEffect(() => {
    if (state.errors && Object.keys(state.errors).length) {
      const keys = Object.keys(state.errors);
      const s1 = ["first_name", "last_name", "address", "postal_code", "city", "phone", "email", "terms_accepted"];
      const s2 = ["delivery_date"];
      if (keys.some((k) => s1.includes(k))) setStep(1);
      else if (keys.some((k) => s2.includes(k))) setStep(2);
      else setStep(3);
    }
  }, [state.errors]);

  // Swish-device detect
  const [deviceType, setDeviceType] = useState<"mobile" | "desktop">("desktop");
  useEffect(() => {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    setDeviceType(/iPhone|iPad|iPod|Android/i.test(ua) ? "mobile" : "desktop");
  }, []);

  // Swish-flows
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [swishUrlMobile, setSwishUrlMobile] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

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

  // Redirect to Stripe Checkout if redirectUrl is present
  useEffect(() => {
    if (state.success && state.stripeRedirectUrl) {
      window.location.href = state.stripeRedirectUrl;
    }
  }, [state.success, state.stripeRedirectUrl]);



  // Rabattkod & totals
  const [campaignCode, setCampaignCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [campaignError, setCampaignError] = useState<string | null>(null);
  const [he59Available, setHe59Available] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(state.values.payment_method);

  useEffect(() => {
    const used = Number(localStorage.getItem("he59_used_count") || "0");
    setHe59Available(used < 10);
  }, []);

  const nonExtraQty = () =>
    cartItems.filter((i) => !i.isExtra).reduce((sum, i) => sum + i.quantity, 0);

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const qty = nonExtraQty();
    const hasBiz = cartItems.some((i) => i.id === "business-50");
    let discount = 0;
    if (discountApplied && !hasBiz && campaignCode.toLowerCase() === "he59" && he59Available && qty > 0 && qty <= 5) {
      discount = subtotal * 0.2;
    }
    const shippingFee = qty >= 5 ? 0 : 19;
    const tax = subtotal * 0.12;
    const total = subtotal + shippingFee + tax - discount;
    return { subtotal, shippingFee, tax, discount, total };
  };

  const validateCoupon = () => {
    const qty = nonExtraQty();
    const used = Number(localStorage.getItem("he59_used_count") || "0");
    const hasBiz = cartItems.some((i) => i.id === "business-50");
    if (campaignCode.toLowerCase() === "he59") {
      if (hasBiz) {
        setDiscountApplied(false);
        setCampaignError("Rabattkoden gäller inte för företagspaket");
        return;
      }
      if (used >= 10 || qty > 5) {
        setDiscountApplied(false);
        setCampaignError("Koden har löpt ut");
      } else {
        setDiscountApplied(true);
        setCampaignError(null);
      }
    } else {
      setDiscountApplied(false);
      setCampaignError("Ogiltig rabattkod");
    }
  };

  // Order-objekt
  const [selectedDelivery_date, setSelectedDelivery_date] = useState<string>(state.values.delivery_date);
  // Visa Swish-QR (desktop)
  if (qrCodeUrl && deviceType === "desktop" && state.swishId) {
    return <DesktopPaymentStatus qrCodeUrl={qrCodeUrl} status={paymentStatus} requestId={state.swishId} />;
  }
  // // Omdirigera mobil
  if (swishUrlMobile && deviceType === "mobile" && state.swishId) {
    return <MobilePaymentStatus swishUrlMobile={swishUrlMobile} status={paymentStatus} requestId={state.swishId} />;
  }

  // Navigeringslogik
  const canNavigateToStep = (target: number): boolean => target < step;

  return (
    <form
      ref={formRef}
      action={formAction}
      className="bg-white p-6 rounded-xl shadow-md max-w-2xl mx-auto space-y-6"
    >
      {/* STEG-INDIKATOR */}
      <CheckoutSteps
        currentStep={step}
        onStepClick={(s) => canNavigateToStep(s) && setStep(s)}
        canNavigateToStep={canNavigateToStep}
      />

      {/* STEG 1 */}
      {step === 1 && (
        <div className="space-y-8">
          {/* Personuppgifter */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-[#FFD54F] to-[#FFB300] rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-black" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Personuppgifter</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Förnamn *
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  value={values.first_name}
                  onChange={(e) => setValues(v => ({ ...v, first_name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#FFD54F] transition-all duration-200"
                />
                <ErrorText error={state.errors.first_name} />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Efternamn *
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  value={values.last_name}
                  onChange={(e) => setValues(v => ({ ...v, last_name: e.target.value }))}
                  className="w-full px-4 py-3	border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#FFD54F] transition-all duration-200"
                />
                <ErrorText error={state.errors.last_name} />
              </div>
            </div>
          </div>

          {/* Leveransadress */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-[#FFD54F] to-[#FFB300] rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-black" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Leveransadress</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Gatuadress *
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  placeholder="Storgatan 123"
                  value={values.address}
                  onChange={(e) => setValues(v => ({ ...v, address: e.target.value }))}
                  className="w-full px-4 py-3	border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#FFD54F] transition-all duration-200"
                />
                <ErrorText error={state.errors.address} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Postnummer *
                  </label>
                  <input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    required
                    placeholder="70210 eller 702 10"
                    value={values.postal_code}
                    onChange={handlePostalCodeChange}
                    className={`
                      w-full px-4 py-3 rounded-lg text-black focus:ring-2 focus:ring-[#FFD54F] transition-all duration-200
                      ${showPostalCodeError ? "border-red-500 bg-red-50" : "border-gray-300 border"}
                    `}
                  />
                  {showPostalCodeError && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      ⚠ Leverans endast till Örebro-postnummer
                    </p>
                  )}
                  <ErrorText error={state.errors.postal_code} />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    Ort *
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    placeholder="Örebro"
                    value={values.city}
                    onChange={(e) => setValues(v => ({ ...v, city: e.target.value }))}
                    className="w-full px-4 py-3	border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#FFD54F] transition-all duration-200"
                  />
                  <ErrorText error={state.errors.city} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="door_code" className="block text-sm font-medium text-gray-700 mb-2">
                    Portkod
                  </label>
                  <input
                    id="door_code"
                    name="door_code"
                    type="text"
                    placeholder="1234"
                    value={values.door_code}
                    onChange={(e) => setValues(v => ({ ...v, door_code: e.target.value }))}
                    className="w-full px-4 py-3	border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#FFD54F] transition-all duration-200"
                  />
                </div>
                <div>
                  <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-2">
                    Våningsplan
                  </label>
                  <input
                    id="floor"
                    name="floor"
                    type="text"
                    placeholder="2 tr"
                    value={values.floor}
                    onChange={(e) => setValues(v => ({ ...v, floor: e.target.value }))}
                    className="w-full px-4 py-3	border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#FFD54F] transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Kontaktuppgifter */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-[#FFD54F] to-[#FFB300] rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-black" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Kontaktuppgifter</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefonnummer *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="070-123 45 67"
                  value={values.phone}
                  onChange={(e) => setValues(v => ({ ...v, phone: e.target.value }))}
                  className="w-full px-4 py-3	border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#FFD54F] transition-all duration-200"
                />
                <ErrorText error={state.errors.phone_number} />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-postadress *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="din@email.se"
                  value={values.email}
                  onChange={(e) => setValues(v => ({ ...v, email: e.target.value }))}
                  className="w-full px-4 py-3	border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#FFD54F] transition-all duration-200"
                />
                <ErrorText error={state.errors.email} />
              </div>
            </div>
          </div>

          {/* Ytterligare information */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-[#FFD54F] to-[#FFB300] rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-black" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Ytterligare information</h3>
            </div>
            <label htmlFor="extra_comment" className="block text-sm font-medium text-gray-700 mb-2">
              Kommentar till leveransen
            </label>
            <textarea
              id="extra_comment"
              name="extra_comment"
              value={values.extra_comment}
              onChange={(e) => setValues(v => ({ ...v, extra_comment: e.target.value }))}
              placeholder="Exempelvis: Lämna vid dörren etc."
              className="w-full border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#FFD54F] transition-all duration-200 resize-none"
              style={{ height: 100 }}
            />
          </div>

          {/* Nästa-knapp */}
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!step1IsValid || isPending}
              className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black font-bold rounded-md hover:opacity-90 transition"
            >
              Nästa
            </button>
          </div>
        </div>
      )}
      {/* STEG 2 */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Leveransdatum */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-[#FFD54F] to-[#FFB300] rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-black" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Leveransdatum</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Välj önskat leveransdatum och tid
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {formattedDeliveryOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedDelivery_date(opt.value)}
                  className={`
                    w-full text-left p-4 border rounded-lg transition
                    ${selectedDelivery_date === opt.value
                      ? "bg-yellow-50 border-yellow-500"
                      : "bg-white border-gray-300"
                    }
                  `}
                >
                  <div className="flex items-center">
                    <span
                      className={`
                        block w-2 h-2 rounded-full mr-2
                        ${selectedDelivery_date === opt.value
                          ? "bg-yellow-500"
                          : "bg-gray-300"
                        }
                      `}
                    />
                    <span className="font-medium text-gray-900">
                      {opt.label}
                    </span>
                  </div>
                  <div className="flex items-center mt-1 text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {["lördag", "söndag"].includes(
                      new Date(opt.value).toLocaleDateString("sv-SE", { weekday: "long" })
                    )
                      ? "16:00 – 20:00"
                      : "18:00 – 22:00"
                    }
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-6 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4 flex items-start gap-3">
              <Truck className="w-5 h-5 mt-0.5" />
              <p>Leveranser mån–fre 18:00–22:00, helg 16:00–20:00.</p>
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              disabled={isPending}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:opacity-90 transition"
            >
              ← Tillbaka
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              disabled={isPending || !selectedDelivery_date}
              className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black font-bold rounded-md hover:opacity-90 transition"
            >
              Nästa
            </button>
          </div>
        </div>
      )}
      {/* STEG 3 */}
      {step === 3 && (
        <div className="space-y-6">
          {/* Din beställning */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-[#FFD54F] to-[#FFB300] rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-black" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Din beställning</h3>
            </div>
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Image
                    src={getItemImage(item.id, item.name)}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.quantity} st</p>
                  </div>
                </div>
                <p className="font-medium text-gray-900">
                  {(item.price * item.quantity).toFixed(2)} kr
                </p>
              </div>
            ))}
            <hr className="my-4" />
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Delsumma</span>
                <span>{calculateTotals().subtotal.toFixed(2)} kr</span>
              </div>
              <div className="flex justify-between">
                <span>Leverans</span>
                <span>{calculateTotals().shippingFee.toFixed(2)} kr</span>
              </div>
              <div className="flex justify-between">
                <span>Moms</span>
                <span>{calculateTotals().tax.toFixed(2)} kr</span>
              </div>
            </div>

            {/* Kampanjkod */}
            <div className="mt-4">
              <label htmlFor="campaignCode" className="block text-sm font-medium text-gray-700 mb-1">
                Kampanjkod
              </label>
              <input
                id="campaignCode"
                name="campaignCode"
                type="text"
                value={campaignCode}
                onChange={(e) => setCampaignCode(e.target.value)}
                onBlur={validateCoupon}
                placeholder="Ange kampanjkod"
                className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#FFD54F] transition-all duration-200"
              />
              {campaignError && <p className="mt-1 text-red-600 text-sm">{campaignError}</p>}
            </div>

            {calculateTotals().discount > 0 && (
              <div className="flex items-center justify-between mt-4">
                <span>Rabatt</span>
                <span className="text-red-600">-{calculateTotals().discount.toFixed(2)} kr</span>
              </div>
            )}

            <div className="mt-2 flex items-center justify-between">
              <span className="font-medium text-gray-900">Totalt att betala</span>
              <span className="text-lg font-bold text-yellow-500">
                {calculateTotals().total.toFixed(2)} kr
              </span>
            </div>
          </div>

          {/* Leveransuppgifter */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-[#FFD54F] to-[#FFB300] rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-black" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Leveransuppgifter</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-x-16">
              <div>
                <p className="font-semibold text-gray-900 mb-2">Adress</p>
                <p className="text-gray-700">{values.first_name} {values.last_name}</p>
                <p className="text-gray-700">{values.address}</p>
                <p className="text-gray-700">{values.postal_code.replace(/\s+/g, "")} {values.city}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Kontakt</p>
                <p className="text-gray-700 break-words">{values.phone}</p>
                <p className="text-gray-700 break-words">{values.email}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Datum & Tid</p>
                <p className="text-gray-700 mb-1">
                  {new Date(selectedDelivery_date).toLocaleDateString("sv-SE", { weekday: "long", day: "numeric", month: "long" })}
                </p>
                <p className="text-gray-700">
                  {["lördag", "söndag"].includes(
                    new Date(selectedDelivery_date).toLocaleDateString("sv-SE", { weekday: "long" })
                  ) ? "16:00 – 20:00" : "18:00 – 22:00"}
                </p>
              </div>
            </div>
          </div>

          {/* Betalningsmetod */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-[#FFD54F] to-[#FFB300] rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-black" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Betalningsmetod</h3>
            </div>
            <label
              onClick={() => setSelectedPaymentMethod("swish")}
              className={`mb-3 flex h-20 items-center justify-between p-4 border rounded-lg cursor-pointer transition ${selectedPaymentMethod === "swish" ? "bg-yellow-50 border-yellow-500" : "bg-white border-gray-300"
                }`}
            >
              <div className="flex items-center">
                <span
                  className={`w-3 h-3 rounded-full mr-3 ${selectedPaymentMethod === "swish" ? "bg-yellow-500" : "bg-gray-300"
                    }`}
                />
                <div>
                  <p className="font-medium text-gray-900">Swish</p>
                  <p className="text-sm text-gray-600">Betala med Swish</p>
                </div>
              </div>
              <Image
                src="https://i.ibb.co/4RJ927th/Swish-payment-Logo-wine-removebg-preview.png"
                alt="Swish"
                width={64}
                height={64}
                className="object-contain"
              />
            </label>

            <label
              onClick={() => setSelectedPaymentMethod("klarna")}
              className={`mb-3 flex h-20 items-center justify-between p-4 border rounded-lg cursor-pointer transition ${selectedPaymentMethod === "klarna" ? "bg-yellow-50 border-yellow-500" : "bg-white border-gray-300"
                }`}
            >
              <div className="flex items-center">
                <span
                  className={`w-3 h-3 rounded-full mr-3 ${selectedPaymentMethod === "klarna" ? "bg-yellow-500" : "bg-gray-300"
                    }`}
                />
                <div>
                  <p className="font-medium text-gray-900">Klarna</p>
                  <p className="text-sm text-purple-600">Betala med Klarna</p>
                </div>
              </div>
              <Image src="/Assets/klarna.png" alt="Klarna" width={64} height={64} className="object-contain" />
            </label>

            <label
              onClick={() => setSelectedPaymentMethod("card")}
              className={`flex h-20 items-center justify-between p-4 border rounded-lg cursor-pointer transition ${selectedPaymentMethod === "card" ? "bg-yellow-50 border-yellow-500" : "bg-white border-gray-300"
                }`}
            >
              <div className="flex items-center">
                <span
                  className={`w-3 h-3 rounded-full mr-3 ${selectedPaymentMethod === "card" ? "bg-yellow-500" : "bg-gray-300"
                    }`}
                />
                <div>
                  <p className="font-medium text-gray-900">Kreditkort</p>
                  <p className="text-sm text-blue-600">Betala med kort</p>
                </div>
              </div>
              <Image src="/Assets/card.png" alt="Card" width={64} height={64} className="object-contain" />
            </label>

          </div>

          {/* Villkor */}
          <div className="flex items-start space-x-2 mt-4">
            <input
              id="terms_accepted"
              name="terms_accepted"
              type="checkbox"
              required
              defaultChecked={state.values.terms_accepted}
              disabled={isPending}
              className="appearance-none form-checkbox h-5 w-5 border border-gray-300 bg-white rounded focus:ring-yellow-300 checked:bg-yellow-500 checked:border-yellow-500"
            />
            <label htmlFor="terms_accepted" className="text-base text-gray-700">
              Jag har läst och godkänner{" "}
              <Link href="/terms" className="text-transparent bg-gradient-to-r from-[#FFD54F] to-[#FFB300] bg-clip-text hover:underline">
                allmänna villkor
              </Link>{" "}
              och{" "}
              <Link href="/privacy-policy" className="text-transparent bg-gradient-to-r from-[#FFD54F] to-[#FFB300] bg-clip-text hover:underline">
                integritetspolicy
              </Link>
              *
            </label>
          </div>
          <ErrorText error={state.errors.terms_accepted} />

          {/* Navigering & Submit */}
          <div className="flex items-center justify-between mt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={isPending}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:opacity-90 transition"
            >
              ← Tillbaka
            </button>
            <div className="flex-1" />
            {/* Dolda inputs */}
            <input type="hidden" name="first_name" value={values.first_name} />
            <input type="hidden" name="last_name" value={values.last_name} />
            <input type="hidden" name="address" value={values.address} />
            <input
              type="hidden"
              name="postal_code"
              value={values.postal_code.replace(/\s+/g, "")}
            />
            <input type="hidden" name="city" value={values.city} />
            <input type="hidden" name="phone" value={values.phone} />
            <input type="hidden" name="email" value={values.email} />
            <input type="hidden" name="door_code" value={values.door_code} />
            <input type="hidden" name="floor" value={values.floor} />
            <input type="hidden" name="extra_comment" value={values.extra_comment} />
            <input type="hidden" name="delivery_date" value={selectedDelivery_date} />
            <input type="hidden" name="campaign_code" value={campaignCode} />
            <input type="hidden" name="discount_applied" value={discountApplied.toString()} />
            <input type="hidden" name="total_price" value={calculateTotals().total.toFixed(2)} />
            <input type="hidden" name="delivery_fee" value={calculateTotals().shippingFee.toFixed(2)} />
            <input type="hidden" name="discount" value={calculateTotals().discount.toFixed(2)} />
            <input type="hidden" name="device_type" value={deviceType} />
            <input type="hidden" name="cart_items" value={JSON.stringify(cartItems)} />
            <input type="hidden" name="payment_method" value={selectedPaymentMethod} />
            <SubmitButton disabled={isPending || cartItems.length === 0} pending={isPending} title="Slutför och betala" />
          </div>

          {state.message && <AlertMessage state={state} />}
          {cartItems.length === 0 && (
            <p className="text-red-600 font-semibold">Din varukorg är tom. Lägg till produkter innan du slutför beställningen.</p>
          )}
        </div>
      )}
    </form>
  );
}

export default CheckoutForm;
