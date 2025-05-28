import React from 'react';
import Image from 'next/image';

interface PaymentMethodProps {
  selectedPayment: string;
  onPaymentSelect: (method: string) => void;
}

export function PaymentMethod({
  selectedPayment,
  onPaymentSelect,

}: PaymentMethodProps) {
  return (
    <div className="mt-8 space-y-6">
      <h4 className="font-heading text-2xl font-bold text-transparent bg-gradient-to-r bg-clip-text pb-2 border-b-2 border-gradient-to-r from-[#FFD54F] to-[#FFB300]">
        Betalningsmetod
      </h4>
      <button
        type="button"
        onClick={() => onPaymentSelect('swish')}
        className={`w-full px-4 py-3 border rounded-lg text-left transition-all duration-200 flex items-center justify-between ${selectedPayment === 'swish'
          ? 'border-[#FFD54F] bg-yellow-50'
          : 'border-gray-300 hover:border-[#FFD54F]'
          }`}
      >
        <span className="text-black font-medium">Swish</span>
        <Image
          src="https://i.ibb.co/jPtZxwTR/Swish-Logo-Secondary-Light-BG.png"
          alt="Swish"
          className="h-5 w-auto"
          width={60}
          height={20}
        />
      </button>
    </div>
  );
};