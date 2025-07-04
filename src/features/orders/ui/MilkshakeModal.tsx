"use client";

import React, { useState, useEffect } from "react";
import { X, Minus, Plus, Check } from "lucide-react";
import Image from "next/image";
import { extraProteinMeals } from "@/global-ui/meals/MealData";

interface MilkshakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (id: string) => void;
}

export function MilkshakeModal({ isOpen, onClose, onAdd }: MilkshakeModalProps) {
  // Blockera scroll på bakgrunden när modalen är öppen
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // Återställ overflow om komponenten unmountas
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // State för vald kvantitet per shake
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  // State för att markera vilka shakes som lagts till
  const [added, setAdded] = useState<Record<string, boolean>>({});

  // Initiera när modalen öppnas
  useEffect(() => {
    if (isOpen) {
      const initialQty: Record<string, number> = {};
      const initialAdded: Record<string, boolean> = {};
      extraProteinMeals.forEach((shake) => {
        initialQty[shake.id] = 0;
        initialAdded[shake.id] = false;
      });
      setQuantities(initialQty);
      setAdded(initialAdded);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Justera kvantitet
  const adjustQuantity = (id: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }));
  };

  // Lägg till en shake i varukorgen utan att stänga modalen
  // och återställ kvantiteten; visa checkmark
  const handleAddOne = (id: string) => {
    const qty = quantities[id] || 0;
    for (let i = 0; i < qty; i++) {
      onAdd(id);
    }
    setAdded((prev) => ({ ...prev, [id]: true }));
    setQuantities((prev) => ({ ...prev, [id]: 0 }));
  };

  // Kolla om minst en shake har qty > 0 eller är tillagd
  const hasAny =
    Object.values(quantities).some((q) => q > 0) ||
    Object.values(added).some((v) => v);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-auto my-4 max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-black flex-1 text-center">Milkshakes</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Grid: två kolumner */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {extraProteinMeals.map((shake) => {
            const qty = quantities[shake.id] || 0;
            const isAdded = added[shake.id];
            return (
              <div
                key={shake.id}
                className="relative bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center"
              >
                {/* Gradient-rektangel med kcal/protein */}
                <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black rounded-md px-2 py-1 text-[8px] font-semibold leading-tight">
                  <div>{shake.calories} kcal</div>
                  <div>{shake.protein}g protein</div>
                </div>

                {/* Checkmark-cirkel i hörnet om tillagd */}
                {isAdded && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-yellow-300 w-8 h-8 rounded-full flex items-center justify-center shadow">
                    <Check className="w-4 h-4 text-black" />
                  </div>
                )}

                {/* Bild */}
                <div className="w-24 h-24 mb-3 relative">
                  <Image
                    src={shake.image}
                    alt={shake.name}
                    fill
                    className="object-cover rounded-md"
                    quality={100}
                  />
                </div>

                {/* Namn */}
                <p className="font-semibold text-black mb-1">{shake.name}</p>

                {/* Beskrivning */}
                <p className="text-sm text-gray-600 mb-2">{shake.description}</p>

                {/* Pris */}
                <p className="text-lg font-bold bg-gradient-to-r from-yellow-500 to-yellow-300 bg-clip-text text-transparent mb-3">
                  {shake.price.toFixed(2).replace(".", ",")} kr
                </p>

                {/* Kvantitetskontroller */}
                <div className="flex items-center gap-4 mb-3">
                  <button
                    onClick={() => adjustQuantity(shake.id, -1)}
                    disabled={qty === 0}
                    className="p-2 text-gray-500 hover:text-black disabled:opacity-50 transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-lg font-medium text-black w-6">{qty}</span>
                  <button
                    onClick={() => adjustQuantity(shake.id, 1)}
                    className="p-2 text-gray-500 hover:text-black transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Lägg till-knapp när qty > 0 */}
                {qty > 0 && (
                  <button
                    onClick={() => handleAddOne(shake.id)}
                    className="
                      mt-auto
                      px-4 py-2
                      bg-gradient-to-r from-yellow-500 to-yellow-300
                      text-black font-semibold
                      rounded-lg
                      hover:opacity-90
                      transition
                    "
                  >
                    Lägg till
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer-knapp */}
        <button
          onClick={onClose}
          className="w-full py-2 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black font-semibold rounded-md transition-all duration-300"
        >
          {hasAny ? "Gå vidare" : "Avbryt"}
        </button>
      </div>
    </div>
  );
}
