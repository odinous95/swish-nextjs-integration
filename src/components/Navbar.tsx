"use client"
import React, { useState } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface NavbarProps {
  isScrolled: boolean;
  cartItemCount: number;
  onCartClick: () => void;
  scrollToSection: (id: string) => void;
}

export function Navbar({ isScrolled, cartItemCount, onCartClick, scrollToSection }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useRouter();

  const handleMobileMenuClick = (sectionId: string) => {
    navigate.push('/');
    setTimeout(() => {
      scrollToSection(sectionId);
    }, 100);
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    navigate.push('/');
  };

  const handleNavClick = (sectionId: string) => {
    if (window.location.pathname === '/') {
      scrollToSection(sectionId);
    } else {
      navigate.push('/');
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    }
  };

  return (
    <div className="fixed w-full z-40">
      <div className={`bg-black backdrop-blur-sm shadow-lg h-[70px] ${isScrolled ? 'mt-0' : 'mt-[40px]'} transition-all duration-300`}>
        <div className="max-w-6xl mx-auto px-4 h-full flex items-center">
          <button
            className="md:hidden mr-4 text-white hover:text-[#FFD54F] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          <div
            className="w-[200px] flex items-center gap-3 cursor-pointer"
            onClick={handleLogoClick}
          >
            <Image
              src="https://i.ibb.co/h1Mskmyq/HElogo-removebg-preview.png"
              alt="HEALTHY EATING Logo"
              width={48}
              height={48}
              className="h-12 w-auto"
              priority
            />
            <h3 className="font-heading text-transparent bg-gradient-to-r from-[#FFD54F] to-[#FFB300] bg-clip-text text-xl font-bold whitespace-nowrap">
              HEALTHY EATING
            </h3>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="hidden md:flex items-center justify-center space-x-8">
              {[
                { text: 'MENY', onClick: () => handleNavClick('meals-section') },
                { text: 'HUR DET FUNKAR', onClick: () => handleNavClick('how-it-works') },
                { text: 'OMDÖMEN', onClick: () => handleNavClick('testimonials') },
                { text: 'KONTAKTA OSS', onClick: () => handleNavClick('footer') }
              ].map((item) => (
                <button
                  key={item.text}
                  onClick={item.onClick}
                  className="relative group cursor-pointer"
                >
                  <span className="text-white hover:text-transparent hover:bg-gradient-to-r hover:from-[#FFD54F] hover:to-[#FFB300] hover:bg-clip-text transition-all duration-300 font-medium">
                    {item.text}
                  </span>
                  <span className="nav-link-underline"></span>
                </button>
              ))}
            </div>
          </div>

          <div className="w-[200px] flex justify-end">
            <button
              onClick={onCartClick}
              className="relative p-2 hover:scale-105 hover:cursor-pointer transition-transform duration-300"
            >
              <ShoppingCart className="w-6 h-6" style={{ stroke: 'url(#icon-gradient)' }} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#FFD54F] to-[#FFB300] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className={`md:hidden absolute w-full bg-black transition-all duration-300 ${isMobileMenuOpen ? 'max-h-64 border-t border-gray-800' : 'max-h-0 overflow-hidden'}`}>
          {[
            { text: 'MENY', id: 'meals-section' },
            { text: 'HUR DET FUNKAR', id: 'how-it-works' },
            { text: 'OMDÖMEN', id: 'testimonials' },
            { text: 'KONTAKTA OSS', id: 'footer' }
          ].map((item) => (
            <button
              key={item.text}
              onClick={() => handleMobileMenuClick(item.id)}
              className="w-full px-4 py-3 text-left text-white hover:bg-gray-800 transition-colors"
            >
              {item.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};