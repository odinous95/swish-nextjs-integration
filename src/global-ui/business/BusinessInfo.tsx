import React from 'react';
import Image from 'next/image';

export function BusinessInfo() {
  return (
    <div className="relative h-full overflow-hidden rounded-xl" style={{ minHeight: '264px' }}>
      <Image
        src="https://i.ibb.co/VY0MyktJ/Chat-GPT-Image-2-juni-2025-21-44-56.png"
        alt="Business Catering"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent"></div>
        <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(255,193,7,0.2)]"></div>
        <div className="relative p-8 max-w-lg z-10">
          <h3 className="font-heading text-2xl font-bold text-white mb-4 drop-shadow-lg">
            Catering för företag
          </h3>
          <p className="text-white/90 text-lg drop-shadow-lg">
          Bjud dina anställda på hälsosamma och välsmakande matlådor – anpassade efter företagets behov! Perfekt för konferenser, möten och företagsevents.
          </p>
        </div>
      </div>
    </div>
  );
};
