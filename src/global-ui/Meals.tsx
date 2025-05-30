"use client";
import React, { useState, useEffect } from 'react';
import MealCard from '../components/meals/MealCard';
import MealModal from '../components/meals/MealModal';
import DesktopMealCard from '../components/meals/DesktopMealCard';
import { meals } from '../components/meals/MealData';

interface MealsProps {
  showQuantity: { [key: string]: boolean };
  quantities: { [key: string]: number };
  buttonStates: { [key: string]: boolean };
  handleButtonClick: (id: string, name: string, price: number) => void;
  adjustQuantity: (id: string, delta: number) => void;
}

export function Meals({
  showQuantity,
  quantities,
  buttonStates,
  handleButtonClick,
  adjustQuantity
}: MealsProps) {
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = selectedMeal ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedMeal]);

  const openMealModal = (id: string) => {
    setSelectedMeal(id);
  };

  const selectedMealData = meals.find(meal => meal.id === selectedMeal);

  return (
    <section id="meals-section" className="py-16 px-4 bg-white text-black">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-center mb-10">
          Utforska Våra Utsökta Måltider
        </h2>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-6">
          {meals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              showQuantity={showQuantity}
              quantities={quantities}
              buttonStates={buttonStates}
              handleButtonClick={handleButtonClick}
              adjustQuantity={adjustQuantity}
              onMealClick={openMealModal}
            />
          ))}
        </div>

        {/* Mobile Modal */}
        <MealModal
          meal={selectedMealData ?? null}
          onClose={() => setSelectedMeal(null)}
          showQuantity={showQuantity}
          quantities={quantities}
          buttonStates={buttonStates}
          handleButtonClick={handleButtonClick}
          adjustQuantity={adjustQuantity}
        />

        {/* Desktop Grid Layout */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {meals.map((meal) => (
            <DesktopMealCard
              key={meal.id}
              meal={meal}
              showQuantity={showQuantity}
              quantities={quantities}
              buttonStates={buttonStates}
              handleButtonClick={handleButtonClick}
              adjustQuantity={adjustQuantity}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
