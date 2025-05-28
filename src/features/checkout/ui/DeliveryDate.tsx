import React from 'react';
import { DeliveryDateType } from '../types';

interface DeliveryDateProps {
  selectedDeliveryDate: string;
  availableDates: DeliveryDateType[];
  onDateSelect: (date: string) => void;
}

export function DeliveryDate({
  selectedDeliveryDate,
  availableDates,
  onDateSelect,
}: DeliveryDateProps) {
  return (
    <div className="mt-8 space-y-6">
      <h4 className="font-heading text-2xl font-bold text-transparent bg-gradient-to-r from-[#FFD54F] bg-clip-text pb-2 border-b-2 border-gradient-to-r to-[#FFB300]">
        Leverans
      </h4>
      <div>
        <p className="text-sm text-gray-600 mb-2">Vänligen välj önskat leveransdatum</p>
        <select
          value={selectedDeliveryDate}
          onChange={(e) => onDateSelect(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD54F] focus:border-transparent text-black"
          required
        >
          {availableDates.map((date) => (
            <option key={date.date} value={date.date}>
              {date.dayName} {date.date} ({date.deliveryTime})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};