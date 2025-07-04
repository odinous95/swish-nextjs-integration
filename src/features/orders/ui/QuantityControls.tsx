// src/features/orders/ui/QuantityControls.tsx
import React from 'react';

interface QuantityControlsProps {
  quantity: number;
  onAdjust: (delta: number) => void;
}

export function QuantityControls({ quantity, onAdjust }: QuantityControlsProps) {
  return (
    <div className="inline-flex items-center bg-gray-100 rounded-full">
      <button
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          onAdjust(-1);
        }}
        className="px-4 py-2 text-xl text-gray-700 hover:bg-gray-200 rounded-l-full transition-colors"
      >
        −
      </button>
      <span className="px-6 text-black">{quantity}</span>
      <button
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          onAdjust(1);
        }}
        className="px-4 py-2 text-xl text-gray-700 hover:bg-gray-200 rounded-r-full transition-colors"
      >
        +
      </button>
    </div>
  );
}
