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

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={isMobile ? "/Assets/herosection.png" : "/Assets/herosection.png"}
          alt="Hero background"
          fill
          style={{ objectFit: "cover" }}
          priority
          quality={100}
        />
      </div>

      {/* Overlays are commented out temporarily — remove comments to restore */}

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black/50 via-transparent to-black/80" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl text-center px-6">
        <h1 className="text-white text-4xl font-bold mb-6">
          Ät smart. Spara tid. Må bra. <br />- Örebro
        </h1>
        <button
          onClick={scrollToMeals}
          className="relative inline-block mt-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold rounded-3xl px-10 py-4 shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300 overflow-hidden group"
          aria-label="Beställ nu"
        >
          <span className="relative z-10">BESTÄLL NU!</span>
          <span className="absolute inset-0 rounded-3xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </button>
      </div>
    </section>
  );
}
