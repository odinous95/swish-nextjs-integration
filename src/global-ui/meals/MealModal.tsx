// src/global-ui/meals/MealModal.tsx
"use client";
import React, { useState, useCallback } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { QuantityControls } from "@/features/orders/ui/QuantityControls";
import { SauceSelection } from "@/features/orders/ui/SauceSelection";

interface MealModalProps {
  meal: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    calories: number;
    protein: number;
  } | null;
  onClose: () => void;
  showQuantity: { [key: string]: boolean };
  quantities: { [key: string]: number };
  buttonStates: { [key: string]: boolean };
  handleButtonClick: (id: string, name: string, price: number) => void;
  adjustQuantity: (id: string, delta: number) => void;
}

export function MealModal({
  meal,
  onClose,
  showQuantity,
  quantities,
  buttonStates,
  handleButtonClick,
  adjustQuantity,
}: MealModalProps) {
  if (!meal) return null;

  const [selectedSauce, setSelectedSauce] = useState<string>("");
  const [selectedLemon, setSelectedLemon] = useState<boolean>(false);

  const needsSauceSelection = [
    "shawarma",
    "spett",
    "cevapcici",
    "lax",
    "teriyaki",
    "kyckling",
    "biff",
    "Köttfärs",
  ].includes(meal.id);

  const formatPrice = (price: number) =>
    price.toFixed(2).replace(".", ",");

  const currentQuantity = quantities[meal.id] || 1;
  const baseTotal = meal.price * currentQuantity;
  const extrasPrice =
    (meal.id === "lax" || meal.id === "teriyaki") && selectedLemon
      ? 7
      : 0;
  const finalTotal = (baseTotal + extrasPrice)
    .toFixed(2)
    .replace(".", ",");

  const handleAddToCart = useCallback(() => {
    handleButtonClick(meal.id, meal.name, meal.price);
    if (needsSauceSelection && selectedSauce && selectedSauce !== "Ingen") {
      handleButtonClick(
        `sauce_${selectedSauce.toLowerCase()}`,
        selectedSauce,
        0
      );
    }
    if (
      (meal.id === "lax" || meal.id === "teriyaki") &&
      selectedLemon
    ) {
      handleButtonClick("extra-lemon", "Citron", 7);
    }
    onClose();
  }, [
    meal.id,
    meal.name,
    meal.price,
    selectedSauce,
    selectedLemon,
    needsSauceSelection,
    handleButtonClick,
    onClose,
  ]);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 md:hidden flex items-center justify-center px-4">
      <div className="relative bg-white rounded-xl w-11/12 max-w-sm max-h-[90vh] flex flex-col">
        {/* IMAGE HEADER */}
        <div className="relative flex-shrink-0">
          <Image
            src={meal.image}
            alt={meal.name}
            width={400}
            height={400}
            className="w-full h-auto object-cover rounded-t-xl"
          />
          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="absolute top-3 left-3
                       bg-gradient-to-r from-yellow-500 to-yellow-300
                       text-black rounded-full
                       w-14 h-14
                       flex flex-col items-center justify-center
                       text-[9px] font-semibold leading-tight text-center"
          >
            <span>{meal.calories} kcal</span>
            <span>{meal.protein}g protein</span>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="p-6 flex-1 overflow-y-auto space-y-2">
          {/* Titel */}
          <h3 className="font-sans text-xl font-medium text-black">
            {meal.name}
          </h3>

          {/* Beskrivning */}
          <p className="text-gray-600 text-sm mt-1 mb-2">
            {meal.description}
          </p>

          {/* Pris */}
          <div className="font-sans text-2xl font-medium text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text mb-4">
            {formatPrice(meal.price)} kr
          </div>

          {/* Citron-tillval för lax/teriyaki */}
          {(meal.id === "lax" || meal.id === "teriyaki") && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Tillval:
              </p>
              <button
                onClick={() => setSelectedLemon((l) => !l)}
                className={`inline-flex w-max items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  selectedLemon
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-300 text-black"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Image
                  src="https://i.ibb.co/nsxDDpRs/IMAGE-2025-04-20-00-21-30-removebg-preview.png"
                  alt="Citron"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                Citron (+7 kr)
              </button>
            </div>
          )}

          {/* Sås-val */}
          <SauceSelection
            selectedSauce={selectedSauce}
            onSauceSelect={setSelectedSauce}
            needsSauceSelection={needsSauceSelection}
            mealId={meal.id}
          />
        </div>

        {/* STICKY BOTTOM BAR */}
        <div className="sticky bottom-0 bg-white px-6 py-4 z-10">
          <div className="flex items-end">
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-600 mb-1">
                Totalt: {finalTotal} kr
              </span>
              <QuantityControls
                quantity={currentQuantity}
                onAdjust={(delta) => adjustQuantity(meal.id, delta)}
              />
            </div>
            <button
              onClick={handleAddToCart}
              disabled={needsSauceSelection && !selectedSauce}
              className="ml-auto px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Lägg till
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MealModal;
