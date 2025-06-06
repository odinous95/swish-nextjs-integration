"use client";
import React, { useEffect, useState } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Logo, ReklamBanner } from '.';
import { useCartStore } from '@/store';

export function Navbar() {
  const { setIsCartOpen, getTotalCartItems } = useCartStore();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const navbarHeight = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useRouter();

  const handleMobileMenuClick = (sectionId: string) => {
    navigate.push('/');
    setTimeout(() => scrollToSection(sectionId), 100);
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
      setTimeout(() => scrollToSection(sectionId), 100);
    }
  };

  const cartItemCount = getTotalCartItems();

  return (
    <div className="fixed w-full z-40">
      <ReklamBanner isScrolled={isScrolled} />
      <div
        className={`bg-black backdrop-blur-sm shadow-lg h-[70px] ${
          isScrolled ? 'mt-0' : 'mt-[40px]'
        } transition-all duration-300 relative`}
      >
        {/* Centered links */}
        <div className="hidden md:flex absolute left-1/2 top-0 transform -translate-x-1/2 h-full items-center space-x-8">
          {[
            { text: 'MENY', onClick: () => handleNavClick('meals-section') },
            { text: 'HUR DET FUNKAR', onClick: () => handleNavClick('how-it-works') },
            { text: 'OMDÖMEN', onClick: () => handleNavClick('testimonials') },
            { text: 'KONTAKTA OSS', onClick: () => handleNavClick('footer') },
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

        <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
          {/* Left: Logo + Title */}
          <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
            <div className="w-12 h-12 relative">
              <Logo />
            </div>
            <h3 className="ml-2 font-heading text-transparent bg-gradient-to-r from-[#FFD54F] to-[#FFB300] bg-clip-text text-2xl font-bold whitespace-nowrap">
              HEALTHY EATING
            </h3>
          </div>

          <div className="flex items-center">
            {/* Cart icon (unchanged position) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:scale-105 hover:cursor-pointer transition-transform duration-300"
            >
              <ShoppingCart className="w-6 h-6 text-white" />
              {hasMounted && cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#FFD54F] to-[#FFB300] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden ml-4 text-white hover:text-[#FFD54F] transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile slide-out menu */}
        <div
          className={`md:hidden absolute w-full bg-black transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-64 border-t border-gray-800' : 'max-h-0 overflow-hidden'
          }`}
        >
          {[
            { text: 'MENY', id: 'meals-section' },
            { text: 'HUR DET FUNKAR', id: 'how-it-works' },
            { text: 'OMDÖMEN', id: 'testimonials' },
            { text: 'KONTAKTA OSS', id: 'footer' },
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
}
