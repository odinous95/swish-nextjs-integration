// src/features/orders/ui/BowlsSection.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useCartStore } from "@/store";
import { bowls } from "@/global-ui/meals/MealData";

type Sauce = {
  id: string;
  name: string;
  icon: string;
  price: number;
};

const SAUCES: Sauce[] = [
  { id: "bbq", name: "BBQ", icon: "https://i.ibb.co/3yZ7YrKr/BBQ-removebg.png", price: 10 },
  { id: "kebab", name: "Kebab", icon: "https://i.ibb.co/q3V8nXRc/Kebebs-s-bg.png", price: 10 },
  { id: "none", name: "Ingen sås", icon: "https://i.ibb.co/Y4tPyYY3/prohibition-symbol-warning-is-prohibited-from-entering-circle-red-warning-icon-not-allowed-sign-illu.png", price: 0 },
];

export default function BowlsSection() {
  const { addToCartDirect, handleAddExtras } = useCartStore();

  const [selectedBowlId, setSelectedBowlId] = useState<string | null>(null);
  const [selectedSauce, setSelectedSauce] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const open = (id: string) => {
    setSelectedBowlId(id);
    setSelectedSauce(null);
    setQuantity(1);
  };
  const close = () => setSelectedBowlId(null);

  // Formatera pris med komma
  const formatPrice = (price: number) => price.toFixed(2).replace(".", ",");

  // Klick utanför stänger dropdown
  useEffect(() => {
    if (!selectedBowlId) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [selectedBowlId]);

  const handleAdd = () => {
    if (!selectedBowlId || !selectedSauce) return;

    const bowl = bowls.find((b) => b.id === selectedBowlId)!;
    const sauce = SAUCES.find((s) => s.id === selectedSauce)!;

    // 1) Lägg till bowl N gånger
    for (let i = 0; i < quantity; i++) {
      addToCartDirect(bowl.id, bowl.name, bowl.price);
    }

    // 2) Lägg till sås som extra, med rätt quantity
    if (sauce.id !== "none") {
      handleAddExtras([
        {
          id: sauce.id,
          name: sauce.name,
          price: sauce.price,
          quantity,
        },
      ]);
    }

    close();
  };

  return (
    <section id="bowls" className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-black text-center mb-8">Bowls</h2>
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-8">
          {bowls.map((b) => {
            const expanded = b.id === selectedBowlId;
            const surcharge = selectedSauce
              ? SAUCES.find((s) => s.id === selectedSauce)!.price
              : 0;
            const totalPrice = (b.price + surcharge) * quantity;

            return (
              <div
                key={b.id}
                ref={expanded ? containerRef : undefined}
                className={`
                  relative flex-1 max-w-sm bg-white rounded-2xl shadow-lg
                  overflow-hidden flex flex-col transition-all
                  ${expanded ? "h-auto" : "h-full"}
                `}
              >
                {/* Närings-badge */}
                <div
                  className="
                    absolute top-3 left-3
                    bg-gradient-to-r from-[#FFB300] to-[#FFD54F]
                    text-black rounded-full px-2 py-1
                    text-[10px] font-semibold text-center z-10
                  "
                >
                  <div>{b.calories} kcal</div>
                  <div>{b.protein}g protein</div>
                </div>

                {/* Bild */}
                <div className="relative w-full h-0 pb-[100%] bg-white">
                  <Image src={b.image} alt={b.name} fill className="object-contain" />
                </div>

                {/* Innehåll */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-sans text-xl font-medium mb-2 text-black">{b.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{b.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="
                        font-sans text-lg font-medium
                        bg-gradient-to-r from-yellow-400 to-yellow-500
                        bg-clip-text text-transparent
                      "
                    >
                      {formatPrice(b.price)} kr
                    </span>
                    {!expanded && (
                      <button
                        onClick={() => open(b.id)}
                        className="
                          bg-gradient-to-r from-[#FFB300] to-[#FFD54F]
                          hover:from-[#FFB300] hover:to-[#FFD54F]
                          text-black font-semibold
                          px-4 py-2 rounded-lg
                          flex items-center gap-2 transition-colors
                        "
                      >
                        VÄLJ <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {expanded && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-gray-700 mb-2">Välj sås (ingår):</p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {SAUCES.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => setSelectedSauce(s.id)}
                            className={`
                              flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                              ${
                                selectedSauce === s.id
                                  ? "bg-gradient-to-r from-[#FFB300] to-[#FFD54F] text-black"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }
                            `}
                          >
                            <Image src={s.icon} alt={s.name} width={20} height={20} />
                            <span className="text-sm">
                              {s.name}
                              {s.price > 0 ? ` (+${s.price} kr)` : ""}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Här kommer nya Totalt-raden */}
                      <div className="flex flex-col items-center mb-6">
                        <span className="text-sm text-gray-600 mb-2">
                          Totalt: {formatPrice(totalPrice)} kr
                        </span>
                        <div className="inline-flex items-center bg-gray-100 rounded-full">
                          <button
                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            className="px-4 py-2 text-xl text-gray-700 hover:bg-gray-200 rounded-l-full"
                          >
                            −
                          </button>
                          <span className="px-6 text-black">{quantity}</span>
                          <button
                            onClick={() => setQuantity((q) => q + 1)}
                            className="px-4 py-2 text-xl text-gray-700 hover:bg-gray-200 rounded-r-full"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={handleAdd}
                        disabled={!selectedSauce}
                        className={`
                          w-full font-semibold px-4 py-3 rounded-lg transition-colors
                          ${
                            selectedSauce
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
