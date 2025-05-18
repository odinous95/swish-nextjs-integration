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
  const [swishPhone, setSwishPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const navigate = useRouter();

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize available delivery dates
  useEffect(() => {
    const updateAvailableDates = () => {
      const dates: DeliveryDateType[] = [];
      const now = new Date();
      const currentHour = now.getHours();
      const startDays = currentHour >= 20 ? 2 : 1;

      for (let i = startDays; i <= 7; i++) {
        const date = new Date();
        date.setDate(now.getDate() + i);
        const dayNames = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'];
        const dayName = dayNames[date.getDay()];
        const formattedDate = date.toLocaleDateString('sv-SE', { month: 'numeric', day: 'numeric' });
        const deliveryTime = [0, 6].includes(date.getDay()) ? '16:00 - 20:00' : '08:00 - 13:00';
        dates.push({ dayName, date: formattedDate, fullDate: date, deliveryTime });
      }
      setAvailableDates(dates);
      if (dates.length) setSelectedDeliveryDate(dates[0].date);
    };
    updateAvailableDates();
  }, []);

  const validateCoupon = () => {
    if (campaignCode === 'HE59') {
      const usageCount = parseInt(localStorage.getItem(COUPON_USAGE_KEY) || '0');
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

  const countMealItems = () => cartItems.filter(i => !i.isExtra && i.id !== 'business-50').reduce((s, i) => s + i.quantity, 0);
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((t, i) => t + i.price * i.quantity, 0);
    const hasBusiness = cartItems.some(i => i.id === 'business-50');
    const shippingFee = countMealItems() >= 5 || hasBusiness ? 0 : 19;
    const tax = 3;
    const base = subtotal + shippingFee + tax;
    const discount = discountApplied ? base * 0.2 : 0;
    return { subtotal, shippingFee, tax, discount, total: base - discount };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    setPaymentError(null);

    // Ensure a payment method and delivery date are selected
    if (!selectedPayment || !selectedDeliveryDate) {
      setPaymentError('Vänligen välj betalningsmetod och leveransdatum.');
      return;
    }

    if (selectedPayment === 'swish') {
      setIsProcessing(true);
      const { total } = calculateTotals();
      const orderId = `order_${Date.now()}`;

      try {
        // Initiate Swish payment
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/swish/paymentrequests`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              payerAlias: swishPhone,
              amount: total.toFixed(2),
              message: 'Test E-Commerce',
              callbackIdentifier: orderId,
            }),
          }
        );
        console.log('Swish response:', response);

        const { id, url } = await response.json();
        const swishLink = `swish://paymentrequest?token=${id}`;
        console.log('Swish payment URL:', url);
        if (url) {
          window.location.href = swishLink;
        }
        {
          typeof window !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent) && (
            <a href={`swish://paymentrequest?token=${id}`}>
              Open in Swish App
            </a>
          )
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Swish payment response:', data);

        if (data.paymentUrl) {
          // Show loading modal
          const modal = document.createElement('div');
          modal.id = 'swish-loading-modal';
          modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
          modal.innerHTML = `
            <div class="bg-white rounded-lg p-8 text-center">
              <div class="animate-spin rounded-full h-12 w-12 border-4 border-[#FFD54F] border-t-transparent mx-auto mb-4"></div>
              <p class="text-lg font-semibold">Öppna Swish</p>
            </div>
          `;
          document.body.appendChild(modal);

          // Poll for payment status
          const pollInterval = setInterval(async () => {
            try {
              const statusResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/.netlify/functions/payment-status?orderId=${orderId}`
              );
              if (!statusResponse.ok) {
                throw new Error(`HTTP error! status: ${statusResponse.status}`);
              }
              const statusData = await statusResponse.json();

              if (statusData.status === 'PAID') {
                clearInterval(pollInterval);
                document.getElementById('swish-loading-modal')?.remove();
                setPaymentSuccess(true);
                setIsProcessing(false);
              }
            } catch (err) {
              console.error('Status polling error:', err);
              clearInterval(pollInterval);
              document.getElementById('swish-loading-modal')?.remove();
              setPaymentError('Det gick inte att verifiera betalningen. Vänligen kontakta support.');
              setIsProcessing(false);
            }
          }, 2000);

          // Redirect to Swish
          window.location.href = data.paymentUrl;
        } else {
          throw new Error('Ingen betalningslänk mottagen från server.');
        }
      } catch (err) {
        console.error('Payment error:', err);
        setIsProcessing(false);
        document.getElementById('swish-loading-modal')?.remove();
        setPaymentError('Det gick inte att genomföra betalningen. Vänligen försök igen eller kontakta support.');
      }
    } else {
      // Handle other payment methods here
      onSubmit(e);
    }
  };


  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <div className="w-12 h-12 text-green-500">✓</div>
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-4">Tack för din beställning!</h2>
        </div>
      </div>
    );
  }

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
              onTermsChange={(e) => handleTermsChange(e)}
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
              onCampaignCodeKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); validateCoupon(); } }}
              getTotalPrice={calculateTotals}
            />
            <PaymentMethod
              selectedPayment={selectedPayment}
              onPaymentSelect={setSelectedPayment}
              swishPhone={swishPhone}
              onSwishPhoneChange={(e) => setSwishPhone(e.target.value)}
            />
            {paymentError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{paymentError}</div>}
            <button
              id="swish-submit"
              type="submit"
              disabled={!selectedPayment || !selectedDeliveryDate || showPostalCodeError || (selectedPayment === 'swish' && !swishPhone) || !form.termsAccepted || isProcessing}
              className={`w-full bg-gradient-to-r from-[#FFD54F] to-[#FFB300] text-black font-semibold py-3 px-6 rounded-xl hover:from-[#FFE082] hover:to-[#FFB300] transition-all duration-300 ${(!selectedPayment || !selectedDeliveryDate || showPostalCodeError || (selectedPayment === 'swish' && !swishPhone) || !form.termsAccepted || isProcessing) && 'opacity-50 cursor-not-allowed'}`}
            >
              {isProcessing ? 'Bearbetar...' : 'Slutför och betala'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
