"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();

    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const scrollToMeals = () => {
    const element = document.getElementById("meals-section");
    if (element) {
      const navbarHeight = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Uppdaterade lokala bildvägar
  const mobileBg = "https://i.ibb.co/KzXrSCy6/heromobil.png";
  const desktopBg = "https://i.ibb.co/5W262T46/herosection.png";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Bakgrundsbild */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={isMobile ? mobileBg : desktopBg}
          alt="Hero background"
          fill
          style={{ objectFit: "cover" }}
          priority
          quality={100}
        />
      </div>

      {/* Mörk overlay för bättre kontrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/20" />

      {/* Innehåll (rubrik, beskrivning, knapp) */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
        <h1 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl mb-6 max-w-4xl text-white">
          <span className="md:hidden block leading-tight">
            Hälsosamma<br />
            Matlådor - Örebro
          </span>
          <span className="hidden md:inline block leading-tight">
            Hälsosamma Matlådor<br />
            Örebro
          </span>
        </h1>
        <p className="text-white text-lg md:text-xl lg:text-2xl mb-8 max-w-2xl">
          Smidiga och näringsrika matlådor – klara att avnjutas.
        </p>
        <button
          onClick={scrollToMeals}
          className="relative bg-gradient-to-r from-[#FFD54F] to-[#FFB300] text-black rounded-xl font-semibold px-8 py-3 hover:from-[#FFE082] hover:to-[#FFB300] transition-all duration-300 shadow-[0_8px_30px_rgb(255,213,79,0.15)] hover:scale-105 hover:shadow-[0_8px_30px_rgb(255,213,79,0.25)] overflow-hidden group"
          aria-label="Beställ nu"
        >
          <span className="relative z-10 transition-opacity duration-300">
            BESTÄLL NU!
          </span>
          <span className="absolute inset-0 pointer-events-none group-active:animate-ripple bg-white/25 rounded-full scale-0" />
        </button>
      </div>
    </section>
  );
}

export default Hero;
