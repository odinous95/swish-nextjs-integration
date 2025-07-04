import React from 'react';
import Image from 'next/image';
import { extraProteinMeals, extraProteinBars } from '@/global-ui/meals/MealData';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderSummaryProps {
  cartItems: CartItem[];
  showCampaignCode: boolean;
  campaignCode: string;
  campaignError: string;
  discountApplied: boolean;
  onCampaignCodeToggle: () => void;
  onCampaignCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCampaignCodeBlur: () => void;
  onCampaignCodeKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  getTotalPrice: () => {
    subtotal: number;
    shippingFee: number;
    tax: number;
    discount: number;
    total: number;
  };
}

const getItemImage = (itemId: string, itemName: string): string | null => {
  // 0) Speciellt för Citron
  if (itemId === 'citron' || itemName.toLowerCase().includes('citron')) {
    return 'https://i.ibb.co/sd9w9Gbb/lemon-slice-693588-417-removebg-preview.png'; // Se till att denna fil finns under public/Assets
  }

  // 1) Milkshakes
  const shake = extraProteinMeals.find(s => s.id === itemId);
  if (shake) {
    return shake.image;
  }

  // 2) Protein Bars
  const bar = extraProteinBars.find(b => b.id === itemId);
  if (bar) {
    return bar.image;
  }

  // 3) Extras (t.ex. extra-spett, extra-sriracha etc)
  if (itemId.startsWith('extra-')) {
    const extraImages: { [key: string]: string } = {
      'extra-spett': 'https://i.ibb.co/q3T4kYKP/IMAGE-2025-04-15-20-30-25-removebg-preview.png',
      'extra-cevapcici': 'https://i.ibb.co/yczRd1nS/IMAGE-2025-04-15-20-33-24-removebg-preview.png',
      'extra-sriracha': 'https://i.ibb.co/WWhwHxX7/IMAGE-2025-04-20-23-09-10-removebg-preview.png',
      'extra-vitlok': 'https://i.ibb.co/yFYBcDQN/IMAGE-2025-04-20-23-10-16-removebg-preview.png',
      'extra-ayran': 'https://i.ibb.co/k6wgvh98/IMAGE-2025-04-20-22-43-10-removebg-preview.png',
    };
    return extraImages[itemId] || null;
  }

  // 4) Vanliga måltider
  const images: { [key: string]: string } = {
    shawarma: 'https://i.ibb.co/DHRXg2dc/Whats-App-Bild-2025-06-23-kl-19-22-33-cce46bbe.jpg',
    spett: 'https://i.ibb.co/KjdWDnMg/Whats-App-Bild-2025-06-23-kl-18-50-48-28eaea81.jpg',
    cevapcici: 'https://i.ibb.co/dsXRcKd8/Whats-App-Bild-2025-06-23-kl-18-41-11-d19df085.jpg',
    pasta: 'https://i.ibb.co/3yWMLqMm/Whats-App-Bild-2025-06-23-kl-19-22-25-8d281ba7.jpg',
    lax: 'https://i.ibb.co/Jw9hCG1m/Whats-App-Bild-2025-06-23-kl-19-22-32-b8d79299.jpg',
    teriyaki: 'https://i.ibb.co/CgpJFdH/Whats-App-Bild-2025-06-23-kl-19-22-34-841683a5.jpg',
    kyckling: 'https://i.ibb.co/zkLsLt6/Whats-App-Bild-2025-06-23-kl-18-43-17-7535b062.jpg',
    biff: 'https://i.ibb.co/gbt9YVmm/Whats-App-Bild-2025-06-23-kl-18-54-59-6451bec5.jpg',
    'business-50': 'https://i.ibb.co/LXcyVTnn/972fe2ac-84a5-4bbe-b42d-84ef36554ed7.png',
  };
  const baseId = itemId.split('-')[0];
  if (['shawarma', 'spett', 'cevapcici', 'pasta', 'lax', 'teriyaki'].includes(baseId)) {
    return images[baseId];
  }

  return images[itemId] || null;
};

const formatPrice = (price: number) => {
  const formattedPrice = price.toFixed(2).replace('.', ',');
  if (Number(formattedPrice.replace(',', '.')) >= 10000) {
    return `${Math.floor(Number(formattedPrice.replace(',', '.')))
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} kr`;
  }
  return `${formattedPrice} kr`;
};

export function OrderSummary({
  cartItems,
  showCampaignCode,
  campaignCode,
  campaignError,
  discountApplied,
  onCampaignCodeToggle,
  onCampaignCodeChange,
  onCampaignCodeBlur,
  onCampaignCodeKeyDown,
  getTotalPrice,
}: OrderSummaryProps) {
  const { subtotal, shippingFee, tax, discount, total } = getTotalPrice();

  return (
    <div className="mt-8 space-y-6">
      <div className="space-y-4">
        {cartItems.map((item) => {
          const itemImage = getItemImage(item.id, item.name);
          return (
            <div key={item.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                {itemImage && (
                  <Image
                    src={itemImage}
                    alt={item.name}
                    width={48}
                    height={48}
                    className={`${item.id.startsWith('extra-') ? 'object-contain p-1' : 'object-cover'} rounded-lg w-12 h-12`}
                  />
                )}
                <p className="text-sm text-gray-600">
                  {item.quantity}x {item.name}
                </p>
              </div>
              <p className="text-sm font-medium text-black whitespace-nowrap">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          );
        })}

        <div className="border-t pt-2 mt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Delsumma</span>
            <span className="text-black font-medium">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-600">Leverans</span>
            <span className="text-black font-medium">
              {shippingFee === 0 ? 'Gratis' : `${shippingFee} kr`}
            </span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-600">Moms</span>
            <span className="text-black font-medium">{formatPrice(tax)}</span>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-transparent bg-gradient-to-r from-yellow-500 to-yellow-300 bg-clip-text">
              Rabattkod
            </span>
            <div className="mt-2">
              <input
                type="text"
                value={campaignCode}
                onChange={onCampaignCodeChange}
                onBlur={onCampaignCodeBlur}
                onKeyDown={onCampaignCodeKeyDown}
                placeholder="Ange rabattkod"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black text-sm"
              />
              {campaignError && (
                <p className="text-red-500 text-xs mt-1">{campaignError}</p>
              )}
            </div>
          </div>
          <div className="flex justify-between text-base font-medium mt-2 pt-2 border-t">
            <span className="text-gray-800">Totalt (inkl. moms)</span>
            <div className="flex flex-col items-end">
              {discountApplied && (
                <>
                  <span className="text-gray-400 line-through text-sm">
                    {formatPrice(subtotal + shippingFee + tax)}
                  </span>
                  <span className="text-red-500 text-sm">
                    - {formatPrice(discount)}
                  </span>
                </>
              )}
              <span className="text-transparent bg-gradient-to-r from-yellow-500 to-yellow-300 bg-clip-text">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
