// src/components/MealCard.tsx
"use client"

import React, { useState } from "react";
import Image from "next/image";
import { ShoppingBasket } from "lucide-react";
import { SauceSelection } from "@/features/orders/ui/SauceSelection";

interface MealCardProps {
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
  onMealClick: (id: string) => void;
}

export function MealCard({
  meal,
  showQuantity,
  quantities,
  buttonStates,
  handleButtonClick,
  adjustQuantity,
  onMealClick,
}: MealCardProps) {
  const [selectedSauce, setSelectedSauce] = useState<string>("");

  const formatPrice = (price: number) =>
    price.toFixed(2).replace(".", ",");

  const expanded = !!showQuantity[meal.id];
  const quantity = quantities[meal.id] ?? 1;
  const total = (meal.price * quantity).toFixed(2).replace(".", ",");
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
  const baseDisabled = !buttonStates[meal.id];
  const disabled = needsSauceSelection
    ? baseDisabled || selectedSauce === ""
    : baseDisabled;

  const handleAdd = () => {
    handleButtonClick(meal.id, meal.name, meal.price);
    if (needsSauceSelection && selectedSauce && selectedSauce !== "Ingen") {
      handleButtonClick(
        `sauce_${selectedSauce.toLowerCase()}`,
        selectedSauce,
        0
      );
    }
  };

  return (
    <div
      key={meal.id}
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
      onClick={() => onMealClick(meal.id)}
    >
      {/* HEADER */}
      <div className="flex items-center p-4">
        <Image
          src={meal.image}
          alt={meal.name}
          width={80}
          height={80}
          className="w-20 h-20 object-cover rounded-lg"
        />
        <div className="ml-4 flex-1">
          {/* Namn: samma som desktop */}
          <h3 className="font-sans text-xl font-medium text-black">
            {meal.name}
          </h3>
          {/* Beskrivning: samma som desktop */}
          <p className="text-gray-600 text-sm">
            {meal.calories} kcal • {meal.protein}g protein
          </p>
          <div className="flex items-center justify-between mt-1">
            {/* Pris: samma som desktop */}
            <span className="font-sans text-lg font-medium text-transparent bg-gradient-to-r from-[#FFD54F] to-[#FFB300] bg-clip-text">
              {formatPrice(meal.price)} kr
            </span>
            <ShoppingBasket className="w-5 h-5 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* EXPANDERAT LÄGE */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-200 space-y-4">
          {/* Såsval */}
          {needsSauceSelection && (
            <SauceSelection
              selectedSauce={selectedSauce}
              onSauceSelect={setSelectedSauce}
              needsSauceSelection={needsSauceSelection}
              mealId={meal.id}
            />
          )}

          {/* Kvantitet */}
          <div className="text-center">
            <div className="inline-flex items-center bg-gray-100 rounded-full">
              <button
                onClick={() => adjustQuantity(meal.id, -1)}
                className="px-4 py-2 text-xl text-gray-700 hover:bg-gray-200 rounded-l-full"
              >
                −
              </button>
              <span className="px-6 text-black">{quantity}</span>
              <button
                onClick={() => adjustQuantity(meal.id, 1)}
                className="px-4 py-2 text-xl text-gray-700 hover:bg-gray-200 rounded-r-full"
              >
                +
              </button>
            </div>
          </div>

          {/* Lägg till-knapp */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAdd();
            }}
            disabled={disabled}
            className={`
              w-full font-semibold px-4 py-2 rounded-lg transition-colors
              ${
                disabled
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#FFB300] to-[#FFD54F] text-black hover:opacity-90"
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
