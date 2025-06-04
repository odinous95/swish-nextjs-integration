"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { NutritionInfo, OrderButton } from '..';


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
  showQuantity,
  quantities,
  buttonStates,
  handleButtonClick,
  adjustQuantity,
}: DesktopMealCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const formatPrice = (price: number) => price.toFixed(2).replace('.', ',');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOrderClick = () => {
    setIsExpanded(true);
  };

  const handleAddToCart = (id: string, name: string, price: number) => {
    handleButtonClick(id, name, price);
    setIsExpanded(false);
  };

  return (
    <div
      ref={cardRef}
      className={`relative flex flex-col justify-between h-full bg-white rounded-2xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1.5 hover:scale-[1.015] ${isExpanded ? 'z-10' : ''
        }`}
    >
      {/* Image Section */}
      <div className="relative w-full aspect-[4/3]">
        <Image
          src={meal.image}
          alt={meal.name}
          fill
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          className="transition-transform duration-300 hover:scale-110 bg-white"
          sizes="100vw"
          priority
        />
        <NutritionInfo calories={meal.calories} protein={meal.protein} />
      </div>

      {/* Text and CTA Section */}
      <div className="flex flex-col justify-between h-full p-5">
        <div>
          <h3 className="font-heading text-xl font-bold mb-1">{meal.name}</h3>
          <p className="text-gray-500 text-sm mb-3">{meal.description}</p>
        </div>

        <div className="mt-auto">
          <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text mb-4">
            {formatPrice(meal.price)} kr
          </div>

          {isExpanded ? (
            <OrderButton
              id={meal.id}
              name={meal.name}
              price={meal.price}
              showQuantity={showQuantity}
              quantities={quantities}
              buttonStates={buttonStates}
              handleButtonClick={handleAddToCart}
              adjustQuantity={adjustQuantity}
            />
          ) : (
            <button
              onClick={handleOrderClick}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-black rounded-xl font-semibold py-3 px-6 transition-all duration-300 shadow-md hover:from-yellow-300 hover:to-orange-300 hover:scale-105 hover:shadow-lg hover:cursor-pointer"
            >
              BESTÄLL NU
            </button>
          )}
        </div>
      </div>

      {/* Dropdown for Expanded Options */}
      {isExpanded && (
        <div className="absolute left-0 right-0 bottom-0 bg-white shadow-xl rounded-b-2xl overflow-hidden z-20 animate-fade-in border-t border-gray-100">
          <div className="p-6">
            <OrderButton
              id={meal.id}
              name={meal.name}
              price={meal.price}
              showQuantity={showQuantity}
              quantities={quantities}
              buttonStates={buttonStates}
              handleButtonClick={handleAddToCart}
              adjustQuantity={adjustQuantity}
            />
          </div>
        </div>
      )}
    </div>
  );
};

