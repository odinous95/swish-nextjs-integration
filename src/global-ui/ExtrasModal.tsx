// src/features/orders/ui/ExtrasModal.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Minus, X, Check } from 'lucide-react';
import Image from 'next/image';
import { extraProteinMeals, extraProteinBars } from '@/global-ui/meals/MealData';

interface Extra {
  id: string;
  name: string;
  price: number;
  image: string;
  calories?: number;
  protein?: number;
}

interface ExtrasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (items: (Extra & { quantity: number })[]) => void;
}

export function ExtrasModal({ isOpen, onClose, onAddToCart }: ExtrasModalProps) {
  const [tab, setTab] = useState<'Tillval' | 'Milkshakes' | 'Protein Bars'>('Tillval');

  const extrasData: Extra[] = [
    { id: 'extra-ayran',     name: 'Ayran',             price: 12, image: 'https://i.ibb.co/k6wgvh98/IMAGE-2025-04-20-22-43-10-removebg-preview.png' },
    { id: 'extra-spett',     name: '1st Kyckling Spett', price: 20, image: 'https://i.ibb.co/q3T4kYKP/IMAGE-2025-04-15-20-30-25-removebg-preview.png' },
    { id: 'extra-cevapcici', name: '3st Cevapcici',     price: 20, image: 'https://i.ibb.co/yczRd1nS/IMAGE-2025-04-15-20-33-24-removebg-preview.png' },
    { id: 'extra-sriracha',  name: 'Sriracha',           price: 7,  image: 'https://i.ibb.co/5ghWVRjn/sriracha.png' },
    { id: 'extra-vitlok',    name: 'Vitlök',             price: 7,  image: 'https://i.ibb.co/Pvfk6dhH/Vitlok.png' },
  ];

  const [extraQs, setExtraQs] = useState<Record<string, number>>(
    Object.fromEntries(extrasData.map(e => [e.id, 0]))
  );
  const [addedExtras, setAddedExtras] = useState<Record<string, boolean>>(
    Object.fromEntries(extrasData.map(e => [e.id, false]))
  );
  const [shakeQs, setShakeQs] = useState<Record<string, number>>(
    Object.fromEntries(extraProteinMeals.map(m => [m.id, 0]))
  );
  const [addedShakes, setAddedShakes] = useState<Record<string, boolean>>({});
  const [barQs, setBarQs] = useState<Record<string, number>>(
    Object.fromEntries(extraProteinBars.map(b => [b.id, 0]))
  );
  const [addedBars, setAddedBars] = useState<Record<string, boolean>>({});

  // Blockera scroll på bakgrund (html & body) när modalen är öppen
  useEffect(() => {
    const html = document.documentElement;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      html.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      html.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      html.style.overflow = '';
    };
  }, [isOpen]);

  // Återställ state när modalen öppnas
  useEffect(() => {
    if (isOpen) {
      setAddedExtras(Object.fromEntries(extrasData.map(e => [e.id, false])));
      setAddedShakes(Object.fromEntries(extraProteinMeals.map(m => [m.id, false])));
      setAddedBars(Object.fromEntries(extraProteinBars.map(b => [b.id, false])));
      setExtraQs(Object.fromEntries(extrasData.map(e => [e.id, 0])));
      setShakeQs(Object.fromEntries(extraProteinMeals.map(m => [m.id, 0])));
      setBarQs(Object.fromEntries(extraProteinBars.map(b => [b.id, 0])));
    }
  }, [isOpen]);

  const hasExtras = Object.values(extraQs).some(q => q > 0);

  const adjustExtra = (id: string, delta: number) =>
    setExtraQs(qs => ({ ...qs, [id]: Math.max(0, (qs[id] ?? 0) + delta) }));
  const adjustShake = (id: string, delta: number) =>
    setShakeQs(qs => ({ ...qs, [id]: Math.max(0, (qs[id] ?? 0) + delta) }));
  const adjustBar = (id: string, delta: number) =>
    setBarQs(qs => ({ ...qs, [id]: Math.max(0, (qs[id] ?? 0) + delta) }));

  const handleAddExtras = useCallback(() => {
    const selected = extrasData
      .filter(e => (extraQs[e.id] ?? 0) > 0)
      .map(e => ({ ...e, quantity: extraQs[e.id] }));
    if (selected.length === 0) return;

    onAddToCart(selected);
    setAddedExtras(prev => {
      const next = { ...prev };
      selected.forEach(item => { next[item.id] = true; });
      return next;
    });
    setExtraQs(Object.fromEntries(extrasData.map(e => [e.id, 0])));
  }, [extraQs, extrasData, onAddToCart]);

  const handleAddShake = (id: string) => {
    const qty = shakeQs[id] ?? 0;
    if (qty === 0) return;
    const item = extraProteinMeals.find(m => m.id === id)!;
    onAddToCart([{ ...item, quantity: qty }]);
    setAddedShakes(prev => ({ ...prev, [id]: true }));
    setShakeQs(prev => ({ ...prev, [id]: 0 }));
  };

  const handleAddBar = (id: string) => {
    const qty = barQs[id] ?? 0;
    if (qty === 0) return;
    const item = extraProteinBars.find(b => b.id === id)!;
    onAddToCart([{ ...item, quantity: qty }]);
    setAddedBars(prev => ({ ...prev, [id]: true }));
    setBarQs(prev => ({ ...prev, [id]: 0 }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-auto my-4 max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Flikar */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-6">
            {(['Tillval','Milkshakes','Protein Bars'] as const).map(t => (
              <span
                key={t}
                onClick={() => setTab(t)}
                className={`cursor-pointer text-sm font-medium px-2 py-1 rounded ${
                  tab === t
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-300 text-black'
                    : 'text-gray-500'
                }`}
              >
                {t}
              </span>
            ))}
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Innehåll */}
        <div className="flex-1 overflow-y-auto mb-4">
          {tab === 'Tillval' && (
            <div className="space-y-3">
              {extrasData.map(extra => (
                <div key={extra.id} className="relative flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  {/* Checkmark i hörnet överst */}
                  {addedExtras[extra.id] && (
                    <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-yellow-500 to-yellow-300 w-6 h-6 rounded-full flex items-center justify-center shadow">
                      <Check className="w-4 h-4 text-black" />
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 relative">
                      <Image
                        src={extra.image}
                        alt={extra.name}
                        fill
                        className="object-contain rounded-lg"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-black text-sm">{extra.name}</h4>
                      <p className="text-xs text-gray-500">{extra.price} kr</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => adjustExtra(extra.id, -1)}
                      disabled={(extraQs[extra.id] ?? 0) === 0}
                      className="text-gray-500 hover:text-black disabled:opacity-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="min-w-[20px] text-center text-black font-normal">
                      {extraQs[extra.id] ?? 0}
                    </span>
                    <button
                      onClick={() => adjustExtra(extra.id, 1)}
                      className="text-gray-500 hover:text-black"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'Milkshakes' && (
            <div className="grid grid-cols-2 gap-4">
              {extraProteinMeals.map(shake => {
                const qty = shakeQs[shake.id] ?? 0;
                const added = addedShakes[shake.id];
                return (
                  <div key={shake.id} className="relative bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center">
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black rounded-md px-2 py-1 text-[8px] font-semibold">
                      <div>{shake.calories} kcal</div>
                      <div>{shake.protein}g protein</div>
                    </div>
                    {added && (
                      <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-yellow-500 to-yellow-300 w-8 h-8 rounded-full flex items-center justify-center shadow">
                        <Check className="w-4 h-4 text-black" />
                      </div>
                    )}
                    <div className="w-24 h-24 mb-3 relative">
                      <Image src={shake.image} alt={shake.name} fill className="object-cover rounded-md" />
                    </div>
                    <p className="font-semibold text-black mb-1">{shake.name}</p>
                    <p className="text-sm text-gray-600 mb-2">{shake.description}</p>
                    <p className="text-lg font-bold bg-gradient-to-r from-yellow-500 to-yellow-300 bg-clip-text text-transparent mb-3">
                      {shake.price.toFixed(2).replace('.', ',')} kr
                    </p>
                    <div className="flex items-center gap-4 mb-3">
                      <button
                        onClick={() => adjustShake(shake.id, -1)}
                        disabled={qty === 0}
                        className="p-2 text-gray-500 hover:text-black disabled:opacity-50"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="text-lg text-black font-normal">{qty}</span>
                      <button
                        onClick={() => adjustShake(shake.id, 1)}
                        className="p-2 text-gray-500 hover:text-black"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    {qty > 0 && (
                      <button
                        onClick={() => handleAddShake(shake.id)}
                        className="mt-auto px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black rounded-lg hover:opacity-90 transition"
                      >
                        Lägg till
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'Protein Bars' && (
            <div className="grid grid-cols-2 gap-4">
              {extraProteinBars.map(bar => {
                const qty = barQs[bar.id] ?? 0;
                const added = addedBars[bar.id];
                return (
                  <div key={bar.id} className="relative bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center">
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black rounded-md px-2 py-1 text-[8px] font-semibold">
                      <div>{bar.calories} kcal</div>
                      <div>{bar.protein}g protein</div>
                    </div>
                    {added && (
                      <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-yellow-500 to-yellow-300 w-8 h-8 rounded-full flex items-center justify-center shadow">
                        <Check className="w-4 h-4 text-black" />
                      </div>
                    )}
                    <div className="w-24 h-24 mb-3 relative">
                      <Image src={bar.image} alt={bar.name} fill className="object-cover rounded-md" />
                    </div>
                    <p className="font-semibold text-black mb-1">{bar.name}</p>
                    <p className="text-sm text-gray-600 mb-2">{bar.description}</p>
                    <p className="text-lg font-bold bg-gradient-to-r from-yellow-500 to-yellow-300 bg-clip-text text-transparent mb-3">
                      {bar.price.toFixed(2).replace('.', ',')} kr
                    </p>
                    <div className="flex items-center gap-4 mb-3">
                      <button
                        onClick={() => adjustBar(bar.id, -1)}
                        disabled={qty === 0}
                        className="p-2 text-gray-500 hover:text-black disabled:opacity-50"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="text-lg text-black font-normal">{qty}</span>
                      <button
                        onClick={() => adjustBar(bar.id, 1)}
                        className="p-2 text-gray-500 hover:text-black"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    {qty > 0 && (
                      <button
                        onClick={() => handleAddBar(bar.id)}
                        className="mt-auto px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black rounded-lg hover:opacity-90 transition"
                      >
                        Lägg till
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <button
          onClick={tab === 'Tillval' ? (hasExtras ? handleAddExtras : onClose) : onClose}
          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-300 text-black font-semibold py-2.5 rounded-xl hover:opacity-90 transition-all"
        >
          {tab === 'Tillval' ? (hasExtras ? 'LÄGG TILL' : 'GÅ VIDARE') : 'GÅ VIDARE'}
        </button>
      </div>
    </div>
  );
}

export default ExtrasModal;
