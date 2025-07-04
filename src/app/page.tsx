// src/app/page.tsx
"use client";

import React, { useState } from "react";
import { useCartStore } from "@/store";
import {
  About,
  BusinessPackage,
  CalorieCalculator,
  FAQ,
  Hero,
  HowItWorks,
  Meals,
  Testimonials,
} from "@/global-ui";
import Image from "next/image";
import { Zap, ArrowRight } from "lucide-react";
import { extraProteinMeals, extraProteinBars } from "@/global-ui/meals/MealData";
import { MilkshakeModal } from "@/features/orders/ui/MilkshakeModal";
import { ProteinBarModal } from "@/features/orders/ui/ProteinBarModal";
import BowlsSection from "@/features/orders/ui/BowlsSection";  // ← Import av nya sektionen

export default function HomePage() {
  const {
    showQuantity,
    quantities,
    buttonStates,
    adjustQuantity,
    handleButtonClick,
    addToCartDirect,
  } = useCartStore();

  const [shakeOpen, setShakeOpen] = useState(false);
  const [barOpen, setBarOpen] = useState(false);

  const handleAddShake = (id: string) => {
    const shake = extraProteinMeals.find((s) => s.id === id);
    if (!shake) return;
    addToCartDirect(shake.id, shake.name, shake.price);
  };

  const handleAddBar = (id: string) => {
    const bar = extraProteinBars.find((b) => b.id === id);
    if (!bar) return;
    addToCartDirect(bar.id, bar.name, bar.price);
  };

  // Protein Shake data
  const shake = {
    id: "protein-shakes",
    name: "Protein Shakes",
    protein: 24,
    price: 27,
    image:
      "https://i.ibb.co/LX2Sz3Xt/Whats-App-Bild-2025-06-11-kl-19-19-23-f2399784.jpg",
  };

  // Protein Bar data
  const bar = {
    id: "protein-bars",
    name: "Protein Bars",
    protein: "13 - 20",
    price: 25,
    image:
      "https://i.ibb.co/Wv9TLf5c/Whats-App-Bild-2025-06-11-kl-19-19-31-2d5dae96.jpg",
  };

  return (
    <main>
      <Hero />
      <HowItWorks />
      <Meals
        showQuantity={showQuantity}
        quantities={quantities}
        buttonStates={buttonStates}
        handleButtonClick={handleButtonClick}
        adjustQuantity={adjustQuantity}
      />

      {/* ===== Ny sektion: Bowls ===== */}
      <BowlsSection />

      {/* ===== Extra Protein ===== */}
      <section id="extra-protein" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-black text-center mb-8">
            Extra Protein
          </h2>

          {/* På mobil: kolumn med items-center; på desktop: rad */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {/* Protein Shakes */}
            <div
              className="relative w-80 h-80 md:w-96 md:h-96 rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => setShakeOpen(true)}
            >
              <Image
                src={shake.image}
                alt={shake.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />

              <div className="absolute top-3 left-3 bg-black/30 p-1 rounded-lg">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="absolute top-3 right-3 flex flex-col items-end">
                <span className="text-white text-base md:text-lg font-bold">
                  {shake.protein}g
                </span>
                <span className="text-white text-xs">PROTEIN</span>
              </div>

              <div className="absolute top-14 md:top-20 left-6 md:left-8 z-10">
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  {shake.name}
                </h3>
              </div>

              <ul className="absolute inset-x-0 top-[35%] md:top-1/3 px-6 md:px-8 space-y-1 md:space-y-2 text-white text-xs md:text-sm list-disc list-inside z-10 text-left">
                <li>24g högkvalitativt protein</li>
                <li>5 olika smaker</li>
                <li>För aktiva dagar</li>
              </ul>

              {/* Prisblock – ligger 4rem ovanför knappen på mobilen */}
              <div className="absolute inset-x-0 bottom-16 md:top-2/3 px-6 md:px-8 flex justify-between items-end text-white z-10">
                <div>
                  <p className="text-xs md:text-sm">Från</p>
                  <p className="text-xl md:text-2xl font-bold">
                    {shake.price} kr
                  </p>
                </div>
                <p className="text-xs md:text-sm"></p>
              </div>

              <button
                onClick={() => {
                  handleAddShake(shake.id);
                  setShakeOpen(true);
                }}
                className="absolute bottom-4 md:bottom-6 inset-x-6 md:inset-x-8 bg-white text-blue-600 font-semibold text-xs md:text-sm py-2 md:py-3 rounded-xl flex items-center justify-center gap-1 md:gap-2 transition"
              >
                VÄLJ SHAKE <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Protein Bars */}
            <div
              className="relative w-80 h-80 md:w-96 md:h-96 rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => setBarOpen(true)}
            >
              <Image
                src={bar.image}
                alt={bar.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />

              <div className="absolute top-3 left-3 bg-black/30 p-1 rounded-lg">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="absolute top-3 right-3 flex flex-col items-end">
                <span className="text-white text-base md:text-lg font-bold">
                  {bar.protein}g
                </span>
                <span className="text-white text-xs">PROTEIN</span>
              </div>

              <div className="absolute top-14 md:top-20 left-6 md:left-8 z-10">
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  {bar.name}
                </h3>
              </div>

              <ul className="absolute inset-x-0 top-[35%] md:top-1/3 px-6 md:px-8 space-y-1 md:space-y-2 text-white text-xs md:text-sm list-disc list-inside z-10 text-left">
                <li>20g snabb energi</li>
                <li>5 olika smaker</li>
                <li>Smart energi</li>
              </ul>

              <div className="absolute inset-x-0 bottom-16 md:top-2/3 px-6 md:px-8 flex justify-between items-end text-white z-10">
                <div>
                  <p className="text-xs md:text-sm">Från</p>
                  <p className="text-xl md:text-2xl font-bold">
                    {bar.price} kr
                  </p>
                </div>
                <p className="text-xs md:text-sm"></p>
              </div>

              <button
                onClick={() => {
                  handleAddBar(bar.id);
                  setBarOpen(true);
                }}
                className="absolute bottom-4 md:bottom-6 inset-x-6 md:inset-x-8 bg-white text-red-600 font-semibold text-xs md:text-sm py-2 md:py-3 rounded-xl flex items-center justify-center gap-1 md:gap-2 transition"
              >
                VÄLJ BAR <ArrowRight className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <BusinessPackage
        showQuantity={showQuantity}
        quantities={quantities}
        buttonStates={buttonStates}
        handleButtonClick={handleButtonClick}
        adjustQuantity={adjustQuantity}
      />
      <CalorieCalculator />
      <About />
      <FAQ />
      <Testimonials />

      <MilkshakeModal
        isOpen={shakeOpen}
        onClose={() => setShakeOpen(false)}
        onAdd={handleAddShake}
      />

      <ProteinBarModal
        isOpen={barOpen}
        onClose={() => setBarOpen(false)}
        onAdd={handleAddBar}
      />
    </main>
  );
}
