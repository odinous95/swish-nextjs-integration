"use client";
import { usePathname } from 'next/navigation';
import React from 'react';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600'], // semibold för en lätt “boldness”
});

interface ReklamBannerProps {
  isScrolled: boolean;
}

export function ReklamBanner({ isScrolled }: ReklamBannerProps) {
  const location = usePathname();
  const excludedPaths = ['/cart'];

  if (location && excludedPaths.includes(location)) {
    return null;
  }

  return (
    <div
      className={`
        fixed top-0 left-0 right-0 z-50
        bg-gradient-to-r from-[#FFD54F] to-[#FFB300]
        text-black 
        transition-all duration-300 ease-in-out
        ${isScrolled ? 'h-0 opacity-0 overflow-hidden' : 'h-[40px] md:h-[40px] opacity-100'}
      `}
    >
      <div className="max-w-6xl mx-auto px-4 h-full">
        <div
          className={`
            ${montserrat.className}
            h-full
            flex flex-col md:flex-row
            items-center justify-center
            text-[10px] md:text-sm
            font-semibold
            leading-tight md:leading-normal
          `}
        >
          <span className="whitespace-nowrap">
            Leveranstider: Måndag - Fredag 18:00 - 22:00, Lördag - Söndag 16:00 - 20:00
          </span>
          <span className="hidden md:inline mx-2">|</span>
          <span className="whitespace-nowrap">
            Fri leverans vid köp av minst 5 matlådor
          </span>
        </div>
      </div>
    </div>
  );
}
