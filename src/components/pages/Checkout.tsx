"use client"

import React, { useState, useEffect } from 'react';
import DeliveryForm from '../checkout/DeliveryForm';
import DeliveryDate from '../checkout/DeliveryDate';
import PaymentMethod from '../checkout/PaymentMethod';
import OrderSummary from '../checkout/OrderSummary';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/global-ui';
import { useCheckoutForm } from '@/hooks/useCheckoutForm';
import { useCartStore } from '@/store';
import { COUPON_USAGE_KEY, MAX_COUPON_USES, validPostalCodes } from '@/data';

type DeliveryDateType = {
  dayName: string;
  date: string;
  fullDate: Date;
  deliveryTime: string;
};

type SwishResponse = {
  deeplink: string;
  token?: string;
};

export function Checkout() {
  const cartItems = useCartStore((state) => state.cartItems);
  const {
    checkoutForm: form,
    inputRefs,
    handleInputChange: onChange,
    handleTermsChange,
    handleInputFocus: onInputFocus,
    handleInputBlur: onInputBlur,
    handleCheckoutSubmit: onSubmit,
  } = useCheckoutForm();

  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState<string>('');
  const [availableDates, setAvailableDates] = useState<DeliveryDateType[]>([]);
  const [showPostalCodeError, setShowPostalCodeError] = useState(false);
  const [showCampaignCode, setShowCampaignCode] = useState(false);
  const [campaignCode, setCampaignCode] = useState('');
  const [campaignError, setCampaignError] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Swish deeplink + token + QR blob URL
  const [swishDeeplink, setSwishDeeplink] = useState<string>('');
  const [swishToken, setSwishToken] = useState<string>('');
  const [showQrFallback, setShowQrFallback] = useState<boolean>(false);
  const [qrBlobUrl, setQrBlobUrl] = useState<string>('');

  const navigate = useRouter();

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Init delivery dates
  useEffect(() => {
    const now = new Date();
    const startDays = now.getHours() >= 20 ? 2 : 1;
    const dates: DeliveryDateType[] = [];
    for (let i = startDays; i <= 7; i++) {
      const d = new Date();
      d.setDate(now.getDate() + i);
      const dayNames = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'];
      dates.push({
        dayName: dayNames[d.getDay()],
        date: d.toLocaleDateString('sv-SE', { month: 'numeric', day: 'numeric' }),
        fullDate: d,
        deliveryTime: [0, 6].includes(d.getDay()) ? '16:00 - 20:00' : '08:00 - 13:00'
      });
    }
    setAvailableDates(dates);
    if (dates.length) setSelectedDeliveryDate(dates[0].date);
  }, []);

  // Coupon logic
  const validateCoupon = () => {
    if (campaignCode === 'HE59') {
      const usageCount = parseInt(localStorage.getItem(COUPON_USAGE_KEY) || '0', 10);
      const totalItems = cartItems.reduce((t, i) => t + i.quantity, 0);
      if (usageCount >= MAX_COUPON_USES || totalItems > 5) {
        setCampaignError('Koden har löpt ut');
        setDiscountApplied(false);
      } else {
        setDiscountApplied(true);
        setCampaignError('');
      }
    } else if (campaignCode) {
      setCampaignError('Koden kunde inte hittas');
      setDiscountApplied(false);
    }
  };

  const handleCampaignCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCampaignCode(e.target.value.trim());
    setCampaignError('');
  };

  const handlePostalCodeBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const code = e.target.value.replace(/\s/g, '');
    const valid = validPostalCodes.includes(code);
    setShowPostalCodeError(!valid && code !== '');
    onInputBlur();
  };

  const countMealItems = () =>
    cartItems.filter(i => !i.isExtra && i.id !== 'business-50').reduce((s, i) => s + i.quantity, 0);

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((t, i) => t + i.price * i.quantity, 0);
    const hasBusiness = cartItems.some(i => i.id === 'business-50');
    const shippingFee = countMealItems() >= 5 || hasBusiness ? 0 : 19;
    const tax = 3;
    const base = subtotal + shippingFee + tax;
    const discount = discountApplied ? base * 0.2 : 0;
    return { subtotal, shippingFee, tax, discount, total: base - discount };
  };

  // Fetch QR blob once fallback & token ready
  // Inside your QR-fallback effect:
  useEffect(() => {
    if (showQrFallback && swishToken) {
      (async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/swish/swishqr`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: swishToken }),
          });
          if (!response.ok) throw new Error(`QR proxy failed ${response.status}`);
          const blob = await response.blob();
          setQrBlobUrl(URL.createObjectURL(blob));
        } catch (err) {
          console.error('Failed to load Swish QR image', err);
        }
      })();
    }
  }, [showQrFallback, swishToken]);


  // Open deeplink & schedule fallback
  useEffect(() => {
    if (!swishDeeplink) return;
    window.location.href = swishDeeplink;
    const timer = setTimeout(() => setShowQrFallback(true), 1000);
    return () => clearTimeout(timer);
  }, [swishDeeplink]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    setPaymentError(null);
    if (!selectedPayment || !selectedDeliveryDate) {
      setPaymentError('Vänligen välj betalningsmetod och leveransdatum.');
      return;
    }
    if (selectedPayment === 'swish') {
      setIsProcessing(true);
      const { total } = calculateTotals();
      const idDigits = Date.now().toString();
      const message = `Order ${idDigits}`;
      const amount = Math.round(total * 100).toString();
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/swish/paymentrequests`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, message, returnUrl: `${process.env.NEXT_PUBLIC_API_URL}/receipt?order=${idDigits}` }),
          }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const { deeplink, token: tok }: SwishResponse = await res.json();
        let t = tok;
        if (!t) {
          const u = new URL(deeplink);
          t = u.searchParams.get('token') || '';
        }
        if (!deeplink || !t) throw new Error('Missing deeplink or token');
        setSwishDeeplink(deeplink);
        setSwishToken(t);
      } catch (err) {
        console.error('Swish M-commerce error:', err);
        setPaymentError('Det gick inte att genomföra betalningen.');
        setIsProcessing(false);
      }
      return;
    }
    onSubmit(e);
  };

  // QR fallback view
  if (showQrFallback && qrBlobUrl) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        <h1 className="text-xl font-bold mb-4">Skanna QR-koden med Swish</h1>
        <img src={qrBlobUrl} alt="Swish QR-kod" className="w-64 h-64 mb-6" />
        <p className="text-gray-600 text-sm text-center">
          Har du problem? Kopiera länken nedan och öppna i din Swish-app:
        </p>
        <a href={qrBlobUrl} className="text-blue-500 text-sm break-all mt-2">
          {qrBlobUrl}
        </a>
      </div>
    );
  }

  // Success view
  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-green-500 text-2xl">✓</div>
          </div>
          <h2 className="text-2xl font-bold text-green-600">Tack för din beställning!</h2>
        </div>
      </div>
    );
  }

  // Main checkout form
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-[110px] pb-16">
        <div id="checkout-container" className="max-w-2xl mx-auto px-4">
          <h1 className="font-heading text-3xl font-bold mb-8 text-center">Kassan</h1>
          <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-xl p-6 shadow-lg">
            <DeliveryForm
              form={form}
              onChange={onChange}
              onInputFocus={onInputFocus}
              onInputBlur={onInputBlur}
              inputRefs={inputRefs}
              showPostalCodeError={showPostalCodeError}
              handlePostalCodeChange={onChange}
              handlePostalCodeBlur={handlePostalCodeBlur}
              onTermsChange={handleTermsChange}
            />
            <DeliveryDate
              selectedDeliveryDate={selectedDeliveryDate}
              availableDates={availableDates}
              onDateSelect={setSelectedDeliveryDate}
            />
            <OrderSummary
              cartItems={cartItems}
              showCampaignCode={showCampaignCode}
              campaignCode={campaignCode}
              campaignError={campaignError}
              discountApplied={discountApplied}
              onCampaignCodeToggle={() => setShowCampaignCode(!showCampaignCode)}
              onCampaignCodeChange={handleCampaignCodeChange}
              onCampaignCodeBlur={validateCoupon}
              onCampaignCodeKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  validateCoupon();
                }
              }}
              getTotalPrice={calculateTotals}
            />
            <PaymentMethod
              selectedPayment={selectedPayment}
              onPaymentSelect={setSelectedPayment} swishPhone={''} onSwishPhoneChange={function (e: React.ChangeEvent<HTMLInputElement>): void {
                throw new Error('Function not implemented.');
              }} />
            {paymentError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {paymentError}
              </div>
            )}
            <button
              id="checkout-submit"
              type="submit"
              disabled={!selectedPayment || !selectedDeliveryDate || showPostalCodeError || !form.termsAccepted || isProcessing}
              className={`w-full bg-gradient-to-r from-[#FFD54F] to-[#FFB300] text-black font-semibold py-3 px-6 rounded-xl hover:from-[#FFE082] hover:to-[#FFB300] transition-all duration-300 ${(!selectedPayment || !selectedDeliveryDate || showPostalCodeError || !form.termsAccepted || isProcessing) && 'opacity-50 cursor-not-allowed'}`}
            >
              {isProcessing ? 'Bearbetar...' : 'Slutför och betala'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
