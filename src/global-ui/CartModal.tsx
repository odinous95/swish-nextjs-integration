// src/global-ui/cart/CartModal.tsx
"use client";
import React from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Hämta dina bowls från MealData
import {
  extraProteinMeals,
  extraProteinBars,
  bowls,
} from '@/global-ui/meals/MealData';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  isExtra?: boolean;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  removeFromCart: (id: string) => void;
  getTotalPrice: () => number;
  adjustQuantity?: (id: string, delta: number) => void;
}

// Mappning för sås-ikoner
const SAUCE_IMAGES: Record<string, string> = {
  bbq:   'https://i.ibb.co/3yZ7YrKr/BBQ-removebg.png',
  kebab: 'https://i.ibb.co/q3V8nXRc/Kebebs-s-bg.png',
};

const getItemImage = (itemId: string, itemName: string): string | null => {
  // 0) Citron – som innan
  if (itemId === 'citron' || itemName.toLowerCase().includes('citron')) {
    return 'https://i.ibb.co/sd9w9Gbb/lemon-slice-693588-417-removebg-preview.png';
  }

  // 1) Bowls
  const bowl = bowls.find(b => b.id === itemId);
  if (bowl) return bowl.image;

  // 2) Såser
  const sauceIcon = SAUCE_IMAGES[itemId];
  if (sauceIcon) return sauceIcon;

  // 3) Protein-shakes
  const shake = extraProteinMeals.find(s => s.id === itemId);
  if (shake) return shake.image;

  // 4) Protein-bars
  const bar = extraProteinBars.find(b => b.id === itemId);
  if (bar) return bar.image;

  // 5) Andra extras (extra-XXX)
  if (itemId.startsWith('extra-')) {
    const extras: Record<string, string> = {
      'extra-spett':      'https://i.ibb.co/q3T4kYKP/IMAGE-2025-04-15-20-30-25-removebg-preview.png',
      'extra-cevapcici':   'https://i.ibb.co/yczRd1nS/IMAGE-2025-04-15-20-33-24-removebg-preview.png',
      'extra-sriracha':    'https://i.ibb.co/WWhwHxX7/IMAGE-2025-04-20-23-09-10-removebg-preview.png',
      'extra-vitlok':      'https://i.ibb.co/yFYBcDQN/IMAGE-2025-04-20-23-10-16-removebg-preview.png',
      'extra-ayran':       'https://i.ibb.co/k6wgvh98/IMAGE-2025-04-20-22-43-10-removebg-preview.png',
    };
    return extras[itemId] || null;
  }

  // 6) Övriga “måltider” via hårdkodad lista
  const meals: Record<string, string> = {
    shawarma:    'https://i.ibb.co/DHRXg2dc/Whats-App-Bild-2025-06-23-kl-19-22-33-cce46bbe.jpg',
    spett:       'https://i.ibb.co/KjdWDnMg/Whats-App-Bild-2025-06-23-kl-18-50-48-28eaea81.jpg',
    cevapcici:   'https://i.ibb.co/dsXRcKd8/Whats-App-Bild-2025-06-23-kl-18-41-11-d19df085.jpg',
    pasta:       'https://i.ibb.co/3yWMLqMm/Whats-App-Bild-2025-06-23-kl-19-22-25-8d281ba7.jpg',
    lax:         'https://i.ibb.co/Jw9hCG1m/Whats-App-Bild-2025-06-23-kl-19-22-32-b8d79299.jpg',
    teriyaki:    'https://i.ibb.co/CgpJFdH/Whats-App-Bild-2025-06-23-kl-19-22-34-841683a5.jpg',
    kyckling:    'https://i.ibb.co/zkLsLt6/Whats-App-Bild-2025-06-23-kl-18-43-17-7535b062.jpg',
    biff:        'https://i.ibb.co/gbt9YVmm/Whats-App-Bild-2025-06-23-kl-18-54-59-6451bec5.jpg',
    Köttfärs:    'https://i.ibb.co/sxCXwtL/Whats-App-Bild-2025-07-01-kl-18-26-49-51241d42.jpg',
    'business-50':'https://i.ibb.co/LXcyVTnn/972fe2ac-84a5-4bbe-b42d-84ef36554ed7.png',
  };

  // 7) Äldre varianter via base-id
  const baseId = itemId.split('-')[0];
  if (['five', 'ten', 'single'].includes(baseId)) {
    if (itemName.includes('Shawarma'))  return meals.shawarma;
    if (itemName.includes('Spett'))     return meals.spett;
    if (itemName.includes('Cevapcici')) return meals.cevapcici;
    if (itemName.includes('Laxfile'))   return meals.lax;
    if (itemName.includes('Teriyaki'))  return meals.teriyaki;
  }

  return meals[itemId] || null;
};

const formatPrice = (price: number) => {
  const formatted = price.toFixed(2).replace('.', ',');
  return formatted.includes(',') ? `${formatted} kr` : `${formatted},00 kr`;
};

export function CartModal({
  isOpen,
  onClose,
  cartItems,
  removeFromCart,
  getTotalPrice,
  adjustQuantity,
}: CartModalProps) {
  const navigate = useRouter();
  if (!isOpen) return null;

  const handleCheckout = () => {
    onClose();
    navigate.push('/checkout');
  };

  // Vi filtrerar bara bort gamla sauce_-poster, dina nya BBQ/Kebab har id "bbq"/"kebab"
  const displayItems = cartItems.filter(item => !item.id.startsWith('sauce_'));

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center pt-10 md:pt-20 px-2 md:px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 w-full max-w-lg mx-2 md:mx-4 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-heading text-xl font-bold text-black">Din varukorg</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6 text-red-500 hover:text-red-600" />
          </button>
        </div>

        {displayItems.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Din varukorg är tom</p>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {displayItems.map((item) => {
                const imgSrc = getItemImage(item.id, item.name);

                return (
                  <div
                    key={`${item.id}-${item.name}`}
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      {imgSrc && (
                        <Image
                          src={imgSrc}
                          alt={item.name}
                          width={64}
                          height={64}
                          className={`${item.isExtra ? 'object-contain p-2' : 'object-cover'} rounded-lg`}
                        />
                      )}
                      <div>
                        <h4 className="font-medium text-black text-sm md:text-base">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => adjustQuantity?.(item.id, -1)}
                            className="text-gray-500 hover:text-black transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-sm text-gray-500">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => adjustQuantity?.(item.id, 1)}
                            className="text-gray-500 hover:text-black transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <p className="font-semibold text-black whitespace-nowrap text-sm md:text-base">
                        {formatPrice(item.quantity * item.price)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-6">
                <span className="font-heading font-bold text-black">Totalt:</span>
                <span className="font-heading font-bold text-transparent bg-gradient-to-r from-yellow-500 to-yellow-300 bg-clip-text text-xl whitespace-nowrap">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-300 text-black font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-all duration-300"
              >
                Till kassan
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
