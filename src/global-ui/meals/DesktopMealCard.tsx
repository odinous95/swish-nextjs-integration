// src/global-ui/DesktopMealCard.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { QuantityControls } from "@/features/orders/ui/QuantityControls";
import { SauceSelection } from "@/features/orders/ui/SauceSelection";

interface DesktopMealCardProps {
  meal: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    calories: number;
    protein: number;
  };
  showQuantity: { [key: string]: boolean };
  quantities: { [key: string]: number };
  buttonStates: { [key: string]: boolean };
  handleButtonClick: (id: string, name: string, price: number) => void;
  adjustQuantity: (id: string, delta: number) => void;
}

export function DesktopMealCard({
  meal,
  quantities,
  handleButtonClick,
  adjustQuantity,
}: DesktopMealCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSauce, setSelectedSauce] = useState<string>("");
  const [selectedLemon, setSelectedLemon] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const formatPrice = (price: number) => price.toFixed(2).replace(".", ",");

  const currentQuantity = quantities[meal.id] || 1;
  const baseTotal = meal.price * currentQuantity;
  const extrasPrice =
    (meal.id === "lax" || meal.id === "teriyaki") && selectedLemon
      ? 7
      : 0;
  const finalTotal = (baseTotal + extrasPrice).toFixed(2).replace(".", ",");

  const needsSauceSelection = [
    "shawarma",
    "spett",
    "cevapcici",
    "lax",
    "teriyaki",
    "kyckling",
    "biff",
    "pasta",
  ].includes(meal.id);

  const handleOrderClick = () => setIsExpanded(true);

  const handleAdd = useCallback(() => {
    handleButtonClick(meal.id, meal.name, meal.price);
    if (selectedSauce && selectedSauce !== "Ingen") {
      handleButtonClick(
        `sauce_${selectedSauce.toLowerCase()}`,
        selectedSauce,
        0
      );
    }
    if ((meal.id === "lax" || meal.id === "teriyaki") && selectedLemon) {
      handleButtonClick("extra-lemon", "Citron", 7);
    }
    setIsExpanded(false);
  }, [
    meal.id,
    meal.name,
    meal.price,
    selectedSauce,
    selectedLemon,
    handleButtonClick,
  ]);

  return (
    <div
      ref={cardRef}
      className="
        relative flex-1 max-w-sm
        bg-white rounded-2xl shadow-lg
        overflow-hidden flex flex-col transition-all
      "
    >
      {/* Bild + badge */}
      <div className="relative w-full h-0 pb-[100%] bg-white">
        <div
          className="
            absolute top-3 left-3
            bg-gradient-to-r from-[#FFB300] to-[#FFD54F]
            text-black rounded-full px-2 py-1
            text-[10px] font-semibold text-center z-10
          "
        >
          <div>{meal.calories} kcal</div>
          <div>{meal.protein}g protein</div>
        </div>
        <Image
          src={meal.image}
          alt={meal.name}
          fill
          className="object-contain transition-transform duration-300 hover:scale-110"
          sizes="(min-width: 768px) 25vw, 100vw"
          priority
        />
      </div>

      {/* Titel, beskrivning, pris */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-sans text-xl font-medium mb-2 text-black">
          {meal.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4">{meal.description}</p>
        <div className="flex items-center justify-between mt-auto">
          <span
            className="
              font-sans text-lg font-medium
              bg-gradient-to-r from-yellow-400 to-yellow-500
              bg-clip-text text-transparent
            "
          >
            {formatPrice(meal.price)} kr
          </span>
          {!isExpanded && (
            <button
              onClick={handleOrderClick}
              className="
                bg-gradient-to-r from-[#FFB300] to-[#FFD54F]
                text-black font-semibold
                px-4 py-2 rounded-lg
                flex items-center gap-2 transition-colors
              "
            >
              VÄLJ <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Expanded-sektion */}
      {isExpanded && (
        <div className="border-t border-gray-100 bg-white p-6 flex flex-col space-y-4">
          {/* Citron-tillval för lax/teriyaki */}
          {(meal.id === "lax" || meal.id === "teriyaki") && (
            <button
              onClick={() => setSelectedLemon((l) => !l)}
              className={`
                inline-flex w-max items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${
                  selectedLemon
                    ? "bg-gradient-to-r from-[#FFB300] to-[#FFD54F] text-black"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
            >
              <Image
                src="https://i.ibb.co/nsxDDpRs/IMAGE-2025-04-20-00-21-30-removebg-preview.png"
                alt="Citron"
                width={20}
                height={20}
                className="rounded-full"
              />
              Citron (+7 kr)
            </button>
          )}

          {/* Sås-val */}
          <SauceSelection
            selectedSauce={selectedSauce}
            onSauceSelect={setSelectedSauce}
            needsSauceSelection={needsSauceSelection}
            mealId={meal.id}
          />

          {/* Totalt + kvantitet */}
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-600 mb-1">
              Totalt: {finalTotal} kr
            </span>
            <QuantityControls
              quantity={currentQuantity}
              onAdjust={(delta) => adjustQuantity(meal.id, delta)}
            />
          </div>

          {/* Lägg till-knapp */}
          <button
            onClick={handleAdd}
            disabled={needsSauceSelection && !selectedSauce}
            className={`
              w-full px-6 py-3 rounded-lg font-semibold transition-colors
              ${
                selectedSauce || !needsSauceSelection
                  ? "bg-gradient-to-r from-[#FFB300] to-[#FFD54F] text-black hover:opacity-90"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            Lägg till
          </button>
        </div>
      )}
    </div>
  );
}
