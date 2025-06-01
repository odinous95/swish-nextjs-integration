"use client";
import React from 'react';
import { useCartStore } from '@/store';
import { About, BusinessPackage, CalorieCalculator, FAQ, Hero, HowItWorks, Meals, Testimonials, } from '@/global-ui';
export default function HomePage() {
  const {
    buttonStates,
    quantities,
    showQuantity,
    adjustQuantity,
    handleButtonClick,
  } = useCartStore();

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
    </main>
  );
};