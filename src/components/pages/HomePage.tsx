
import React from 'react';
import Hero from '../Hero';
import HowItWorks from '../HowItWorks';
import Meals from '../Meals';
import BusinessPackage from '../BusinessPackage';
import CalorieCalculator from '../Pricing';
import About from '../About';
import Testimonials from '../Testimonials';
import { FAQ } from '../FAQ';
import { useCartStore } from '@/store';


export function HomePage() {
  const {
    buttonStates,
    quantities,
    showQuantity,
    adjustQuantity,
    handleButtonClick,
  } = useCartStore();


  return (
    <div className="min-h-screen bg-black text-white font-sans">
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
    </div>
  );
};
