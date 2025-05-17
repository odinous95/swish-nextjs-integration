"use client"
import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import DeliveryForm from '../checkout/DeliveryForm';
import DeliveryDate from '../checkout/DeliveryDate';
import PaymentMethod from '../checkout/PaymentMethod';
import OrderSummary from '../checkout/OrderSummary';
import { CartItem, CheckoutForm, InputRefs } from '../../types';

type DeliveryDateType = {
  dayName: string;
  date: string;
  fullDate: Date;
  deliveryTime: string;
};
import { useRouter } from 'next/navigation';


const COUPON_USAGE_KEY = 'HE59_usage_count';
const MAX_COUPON_USES = 10;
const validPostalCodes = [
  '70210', '70211', '70212', '70213', '70214', '70215', '70216', '70217', '70218', '70219',
  '70221', '70222', '70223', '70224', '70225', '70226', '70227', '70228', '70229', '70230',
  '70231', '70232', '70233', '70234', '70235', '70236', '70237', '70239', '70254', '70281',
  '70282', '70283', '70284', '70285', '70286', '70340', '70341', '70342', '70343', '70344',
  '70345', '70346', '70347', '70348', '70349', '70350', '70351', '70352', '70353', '70354',
  '70355', '70356', '70357', '70358', '70359', '70360', '70361', '70362', '70363', '70364',
  '70365', '70366', '70367', '70368', '70369', '70370', '70371', '70372', '70373', '70374',
  '70375', '70376', '70378', '70380', '70381', '70382', '70383', '70385', '70510', '70591',
  '70592', '70593', '70594', '70595', '70596', '70597', '70598', '71531', '71532', '71572',
  '71591', '71592', '71593', '71594', '71595', '71596', '71894', '71895', '71896', '71897',
  '71930', '71931', '71932', '71940', '71941', '71991', '71992', '71994', '71995'
];

interface CheckoutProps {
  cartItems: CartItem[];
  cartItemCount: number;
  onCartClick: () => void;
  form: CheckoutForm;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onInputFocus: (inputName: string) => void;
  onInputBlur: () => void;
  inputRefs: InputRefs;
}

const Checkout: React.FC<CheckoutProps> = ({
  cartItems,
  cartItemCount,
  onCartClick,
  form,
  onSubmit,
  onChange,
  onInputFocus,
  onInputBlur,
  inputRefs
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState<string>('');
  const [availableDates, setAvailableDates] = useState<DeliveryDateType[]>([]);
  const [isValidPostalCode, setIsValidPostalCode] = useState(true);
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    updateAvailableDates();
  }, []);

  const updateAvailableDates = () => {
    const dates: DeliveryDateType[] = [];
    const now = new Date();
    const currentHour = now.getHours();
    const isAfter8PM = currentHour >= 20;

    const startDays = isAfter8PM ? 2 : 1;

    for (let i = startDays; i <= 7; i++) {
      const date = new Date();
      date.setDate(now.getDate() + i);

      const dayNames = ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag'];
      const dayName = dayNames[date.getDay()];
      const formattedDate = date.toLocaleDateString('sv-SE', {
        month: 'numeric',
        day: 'numeric'
      });

      const deliveryTime = date.getDay() === 0 || date.getDay() === 6
        ? '16:00 - 20:00'
        : '08:00 - 13:00';

      dates.push({
        dayName,
        date: formattedDate,
        fullDate: date,
        deliveryTime
      });
    }

    setAvailableDates(dates);
    if (dates.length > 0) {
      setSelectedDeliveryDate(dates[0].date);
    }
  };

  const validateCoupon = () => {
    if (campaignCode === 'HE59') {
      const usageCount = parseInt(localStorage.getItem(COUPON_USAGE_KEY) || '0');
      const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

      if (usageCount >= MAX_COUPON_USES || totalItems > 5) {
        setCampaignError('Koden har löpt ut');
        setDiscountApplied(false);
        return;
      }

      setDiscountApplied(true);
      setCampaignError('');
    } else if (campaignCode) {
      setCampaignError('Koden kunde inte hittas');
      setDiscountApplied(false);
    }
  };

  const handleCampaignCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.trim();
    setCampaignCode(code);
    setCampaignError('');
  };

  const handleCampaignCodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      validateCoupon();
    }
  };

  const handleCampaignCodeBlur = () => {
    validateCoupon();
  };

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowPostalCodeError(false);
    onChange(e);
  };

  const handlePostalCodeBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const isValid = validatePostalCode(e.target.value);
    setIsValidPostalCode(isValid);
    setShowPostalCodeError(!isValid && e.target.value !== '');
    onInputBlur();
  };

  const validatePostalCode = (code: string) => {
    const normalizedCode = code.replace(/\s/g, '');
    return validPostalCodes.includes(normalizedCode);
  };

  const countMealItems = () => {
    return cartItems.reduce((total, item) => {
      if (!item.isExtra && item.id !== 'business-50') {
        return total + item.quantity;
      }
      return total;
    }, 0);
  };

  const getTotalPrice = () => {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const hasBusinessPackage = cartItems.some(item => item.id === 'business-50');
    const mealItemCount = countMealItems();
    const shippingFee = mealItemCount >= 5 || hasBusinessPackage ? 0 : 19;
    const tax = 3;
    const baseTotal = subtotal + shippingFee + tax;
    const discount = discountApplied ? baseTotal * 0.2 : 0;
    const total = baseTotal - discount;

    return { subtotal, shippingFee, tax, discount, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    if (selectedPayment === 'swish') {
      setIsProcessing(true);
      setPaymentError(null);
      const { total } = getTotalPrice();
      const orderId = `order_${Date.now()}`;

      try {

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/swish/paymentrequests`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Origin': window.location.origin
          },
          body: JSON.stringify({
            payerAlias: swishPhone,
            amount: total.toFixed(2),
            message: 'Test E-Commerce',
            callbackIdentifier: orderId
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

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

          // Start polling
          const pollInterval = setInterval(async () => {
            try {
              const statusResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/.netlify/functions/payment-status?orderId=${orderId}`);
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
            } catch (error) {
              console.error('Status polling error:', error);
              clearInterval(pollInterval);
              document.getElementById('swish-loading-modal')?.remove();
              setPaymentError('Det gick inte att verifiera betalningen. Vänligen kontakta support.');
              setIsProcessing(false);
            }
          }, 2000);

          // Redirect to Swish
          window.location.href = data.paymentUrl;
        }
      } catch (error) {
        console.error('Payment error:', error);
        setIsProcessing(false);
        document.getElementById('swish-loading-modal')?.remove();
        setPaymentError('Det gick inte att genomföra betalningen. Vänligen försök igen eller kontakta support.');
      }
    }
  };

  const handleSwishPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSwishPhone(e.target.value);
  };

  const scrollToSection = (id: string) => {
    navigate.push('/');
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const navbarHeight = 70;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
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
      <Navbar
        isScrolled={isScrolled}
        cartItemCount={cartItemCount}
        onCartClick={onCartClick}
        scrollToSection={scrollToSection}
      />

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
              handlePostalCodeChange={handlePostalCodeChange}
              handlePostalCodeBlur={handlePostalCodeBlur}
              onTermsChange={(e) => {
                const { name, checked } = e.target;
                onChange({
                  ...e,
                  target: { ...e.target, value: checked ? 'true' : 'false', name }
                } as React.ChangeEvent<HTMLInputElement>);
              }}
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
              onCampaignCodeBlur={handleCampaignCodeBlur}
              onCampaignCodeKeyDown={handleCampaignCodeKeyDown}
              getTotalPrice={getTotalPrice}
            />

            <PaymentMethod
              selectedPayment={selectedPayment}
              onPaymentSelect={setSelectedPayment}
              swishPhone={swishPhone}
              onSwishPhoneChange={handleSwishPhoneChange}
            />

            {paymentError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {paymentError}
              </div>
            )}

            <button
              id="swish-submit"
              type="submit"
              disabled={!selectedPayment || !selectedDeliveryDate || !isValidPostalCode || (selectedPayment === 'swish' && !swishPhone) || !form.termsAccepted || isProcessing}
              className={`w-full bg-gradient-to-r from-[#FFD54F] to-[#FFB300] text-black font-semibold py-3 px-6 rounded-xl hover:from-[#FFE082] hover:to-[#FFB300] transition-all duration-300 ${(!selectedPayment || !selectedDeliveryDate || !isValidPostalCode || (selectedPayment === 'swish' && !swishPhone) || !form.termsAccepted || isProcessing) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {isProcessing ? 'Bearbetar...' : 'Slutför och betala'}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;