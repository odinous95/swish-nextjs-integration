"use client"
import React, { useEffect, useState } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Logo, ReklamBanner } from '.';
import { useCartStore } from '@/store';
export function Navbar() {
  const {
    setIsCartOpen,
    getTotalCartItems,
  } = useCartStore();
  const navigate = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

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

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };



  const handleMobileMenuClick = (sectionId: string) => {
    navigate.push('/');
    setTimeout(() => {
      scrollToSection(sectionId);
    }, 100);
    setIsMobileMenuOpen(false);
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

  const cartItemCount = getTotalCartItems();

  return (
    <div className="fixed w-full z-40">
      <ReklamBanner isScrolled={isScrolled} />
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

          <Logo />

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
    </div >
  );
};
