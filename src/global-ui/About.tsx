// src/global-ui/About.tsx
"use client";
import React from "react";

export function About() {
  const images = [
    "/Assets/WhatsApp Bild 2025-06-26 kl. 16.05.41_b09fca2a.jpg",
    "/Assets/WhatsApp Bild 2025-06-28 kl. 21.02.08_d1887f6a.jpg",
  ];
  const total = images.length * 2;

  return (
    <section id="about" className="py-16 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 lg:px-0">
        <div className="relative rounded-2xl shadow-lg overflow-hidden aspect-[16/9]">
          {/* Bildslider */}
          <div
            className="absolute inset-0 flex h-full"
            style={{
              width: `${total * 100}%`,
              animation: `scroll 20s linear infinite`,
            }}
          >
            {[...images, ...images].map((src, i) => (
              <div
                key={i}
                style={{ width: `${100 / total}%`, flexShrink: 0 }}
                className="h-full"
              >
                <img
                  src={src}
                  alt={`Bild ${(i % images.length) + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Overlay-text */}
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <div className="text-center max-w-3xl">
              <p className="text-white text-sm md:text-base lg:text-lg leading-tight">
                När jag startade{" "}
                <span className="text-yellow-400 font-semibold">
                  HEALTHY EATING
                </span>{" "}
                visste jag bara att folk ville ha nyttig och prisvärd mat snabbt –
                idag levererar vi över hela Örebro.
              </p>
              <p className="mt-2 text-white text-sm md:text-base lg:text-lg leading-tight">
                Tack till alla som beställer, delar och stöttar – ni gör det möjligt!
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}

export default About;
