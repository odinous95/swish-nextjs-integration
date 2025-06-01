import React from 'react';
import Image from 'next/image';

interface SauceSelectionProps {
  selectedSauce: string;
  onSauceSelect: (sauce: string) => void;
  needsSauceSelection: boolean;
  mealId: string;
}

export function SauceSelection({
  selectedSauce,
  onSauceSelect,
  needsSauceSelection,
  mealId
}: SauceSelectionProps) {
  if (!needsSauceSelection || mealId === 'pasta') return null;

  const handleSauceSelect = (sauce: string) => {
    // Clear previous selection if clicking the same sauce
    if (selectedSauce === sauce) {
      onSauceSelect('');
    } else {
      onSauceSelect(sauce);
    }
  };

  return (
    <div className="mb-4">
      <p className="text-sm font-medium text-gray-700 mb-2">Välj sås (ingår):</p>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => handleSauceSelect('Sriracha')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedSauce === 'Sriracha'
            ? 'bg-gradient-to-r from-[#FFD54F] to-[#FFB300] text-black'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          <Image
            src="https://i.ibb.co/WWhwHxX7/IMAGE-2025-04-20-23-09-10-removebg-preview.png"
            alt="Sriracha sås"
            width={24}
            height={24}
            className="rounded-full"
          />
          Sriracha
        </button>

        <button
          onClick={() => handleSauceSelect('Vitlök')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedSauce === 'Vitlök'
            ? 'bg-gradient-to-r from-[#FFD54F] to-[#FFB300] text-black'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          <Image
            src="https://i.ibb.co/yFYBcDQN/IMAGE-2025-04-20-23-10-16-removebg-preview.png"
            alt="Vitlök sås"
            width={24}
            height={24}
            className="rounded-full"
          />
          Vitlök
        </button>

        <button
          onClick={() => handleSauceSelect('Ingen')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedSauce === 'Ingen'
            ? 'bg-gradient-to-r from-[#FFD54F] to-[#FFB300] text-black'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          <Image
            src="https://i.ibb.co/Y4tPyYY3/prohibition-symbol-warning-is-prohibited-from-entering-circle-red-warning-icon-not-allowed-sign-illu.png"
            alt="Ingen sås"
            width={24}
            height={24}
            className="rounded-full"
          />
          Ingen sås
        </button>
      </div>
    </div>
  );
};
