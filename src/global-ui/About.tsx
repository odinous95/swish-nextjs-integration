"use client";
import React, { useEffect, useState } from "react";

export function About() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative h-[300px] md:h-[500px] overflow-hidden">
      {isMobile ? (
        // Mobil: en statisk bild
        <img
          src="/Assets/jawad.jpg"
          alt="Mobil version"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      ) : (
        // Desktop: en horisontell slideshow i en loop
        <div className="slider">
          <div className="slides">
            <img
              src="/Assets/jawad.jpg"
              alt="Slide 1"
              className="slide-img"
            />
            <img
              src="/Assets/jawad2.jpg"
              alt="Slide 2"
              className="slide-img"
            />
            {/* Duplicera samma två bilder för sömlös loop */}
            <img
              src="/Assets/jawad.jpg"
              alt="Slide 1 igen"
              className="slide-img"
            />
            <img
              src="/Assets/jawad2.jpg"
              alt="Slide 2 igen"
              className="slide-img"
            />
          </div>
        </div>
      )}

      {/* Halvtransparent svart overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      />

      {/* Texten ovanpå */}
      <div className="relative z-20 h-full max-w-6xl mx-auto px-4 flex flex-col items-center justify-center">
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-8 tracking-wider">
          Om Healthy Eating
        </h2>
        <p className="text-center text-lg md:text-xl max-w-[800px] leading-relaxed font-normal text-white tracking-wide">
          Healthy Eating är dedikerade till att erbjuda färska, näringsrika och
          utsökta matlådelösningar som förenklar din vardag. Vi tror att
          hälsosam kost ska vara smidig, god och tillgänglig för alla.
        </p>
      </div>

      {/* --- Inbäddad CSS via styled-jsx --- */}
      <style jsx>{`
        .slider {
          position: absolute;
          inset: 0; /* top:0; right:0; bottom:0; left:0; */
          overflow: hidden;
          z-index: 0;
        }
        .slides {
          display: flex;
          width: 200%; /* Eftersom vi lägger ut 4 bilder a 50% vardera i rad */
          height: 100%;
          animation: slideAnim 20s linear infinite;
        }
        .slide-img {
          width: 50%; /* Varje bild använder halva bredden av .slides-container */
          height: 100%;
          object-fit: cover;
          flex-shrink: 0;
        }
        @keyframes slideAnim {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
