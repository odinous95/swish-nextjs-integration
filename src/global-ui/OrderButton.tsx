// src/global-ui/OrderButton.tsx
"use client";
import React, { useState, useCallback, memo } from "react";
import { Check } from "lucide-react";
import { QuantityControls } from "../features/orders/ui/QuantityControls";
import { SauceSelection } from "../features/orders/ui/SauceSelection";
import Image from "next/image";
import { OrderButtonProps } from "@/features/orders/types";
import { HeroButton } from "@/global-ui/HeroButton";  // <-- Här importen som saknades

function OrderButtonComponent({
  id,
  name = "",
  price = 0,
  small = false,
  className = "",
  isHeroButton = false,
  quantities = {},
  buttonStates = {},
  handleButtonClick = () => {},
  adjustQuantity = () => {},
  scrollToSection = () => {},
}: OrderButtonProps) {
  const [selectedSauce, setSelectedSauce] = useState<string>("");
  const [selectedLemon, setSelectedLemon] = useState<boolean>(false);

  const needsSauceSelection = React.useMemo(
    () =>
      ["shawarma", "spett", "cevapcici", "lax", "teriyaki"].includes(id),
    [id]
  );

  const handleSauceSelect = useCallback((sauce: string) => {
    setSelectedSauce(sauce);
  }, []);

  const handleLemonToggle = useCallback(() => {
    setSelectedLemon((prev) => !prev);
  }, []);

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (needsSauceSelection && !selectedSauce) return;

      let finalName = name;
      if (selectedSauce && selectedSauce !== "Ingen") {
        finalName = `${name} (${selectedSauce})`;
      }
      handleButtonClick(id, finalName, price);

      if ((id === "lax" || id === "teriyaki") && selectedLemon) {
        handleButtonClick("extra-lemon", "Citron", 7);
      }

      setSelectedSauce("");
      setSelectedLemon(false);
    },
    [
      id,
      name,
      price,
      needsSauceSelection,
      selectedSauce,
      selectedLemon,
      handleButtonClick,
    ]
  );

  const onAdjust = useCallback(
    (delta: number) => adjustQuantity(id, delta),
    [adjustQuantity, id]
  );

  if (isHeroButton) {
    return (
      <HeroButton
        small={small}
        className={className}
        scrollToSection={scrollToSection}
      />
    );
  }

  const currentQuantity = quantities[id] || 1;
  const baseTotal = price * currentQuantity;
  const extrasPrice =
    (id === "lax" || id === "teriyaki") && selectedLemon ? 7 : 0;
  const finalTotalPrice = baseTotal + extrasPrice;

  return (
    <div className="relative">
      {(id === "lax" || id === "teriyaki") && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Tillval:</p>
          <button
            onClick={handleLemonToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
              selectedLemon
                ? "bg-gradient-to-r from-yellow-500 to-yellow-300 text-black"
                : "bg-gray-100 text-gray-700"
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

      <SauceSelection
        selectedSauce={selectedSauce}
        onSauceSelect={handleSauceSelect}
        needsSauceSelection={needsSauceSelection}
        mealId={id}
      />

      <div className="flex items-end py-2">
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-600 mb-1">
            Totalt: {finalTotalPrice.toFixed(2).replace(".", ",")} kr
          </span>
          <QuantityControls quantity={currentQuantity} onAdjust={onAdjust} />
        </div>

        <button
          onClick={handleAddToCart}
          disabled={needsSauceSelection && !selectedSauce}
          className={`ml-auto flex items-center justify-center px-6 py-3 text-sm font-semibold text-black bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
          {buttonStates[id] && <Check className="mr-2 w-5 h-5" />}
          Lägg till
        </button>
      </div>
    </div>
  );
}

export const OrderButton = memo(OrderButtonComponent);
