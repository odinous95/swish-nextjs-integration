import React from 'react';
import BusinessPackage from '../BusinessPackage';
import CalorieCalculator from '../Pricing';
import { useCartStore } from '@/store';
import { About, FAQ, Hero, HowItWorks, Meals, Testimonials, } from '@/global-ui';



export function HomePage() {
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
