"use client";
import React from "react";

export function About() {
  return (
    <div className="relative h-[300px] md:h-[500px] overflow-hidden">
      {/* Samma statiska bild för både desktop och mobil */}
      <img
        src="/Assets/jawad.jpg"
        alt="Healthy Eating"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Halvtransparent svart overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      />

      {/* Texten ovanpå */}
      <div className="relative z-20 h-full max-w-6xl mx-auto px-4 flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-8 tracking-wider">
            HEALTHY EATING
          </h2>
          <p className="text-center text-lg md:text-xl max-w-[800px] leading-relaxed font-normal text-white tracking-wide">
            Healthy Eating är dedikerade till att erbjuda färska, näringsrika och utsökta
            matlådelösningar som förenklar din vardag. Vi tror att hälsosam kost ska vara
            smidig, god och tillgänglig för alla.
          </p>
        </div>
      </div>
    </div>
  );
}
