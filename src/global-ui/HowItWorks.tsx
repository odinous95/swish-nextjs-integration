import React from "react";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 px-4 bg-white text-black">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-center mb-12 tracking-tight">
          Hälsosam Mat – På Ett Enkelt Sätt
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Steg 1 */}
          <div className="relative h-64 rounded-2xl overflow-hidden">
            <img
              src="/Assets/jawadihpone.jpg"
              alt="Välj dina måltider"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 hover:bg-black/40 transition-all duration-300 rounded-2xl" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <h3 className="font-heading text-2xl font-semibold mb-2 text-white">
                Välj dina måltider
              </h3>
              <p className="text-white">
                Välj bland våra näringsrika och välbalanserade måltider
              </p>
            </div>
          </div>

          {/* Steg 2 */}
          <div className="relative h-64 rounded-2xl overflow-hidden">
            <img
              src="/Assets/jawadiphone2.jpg"
              alt="Vi lagar och packar färskt"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 hover:bg-black/40 transition-all duration-300 rounded-2xl" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <h3 className="font-heading text-2xl font-semibold mb-2 text-white">
                Vi lagar och packar färskt
              </h3>
              <p className="text-white">
                Våra kockar tillagar din mat med färska råvaror
              </p>
            </div>
          </div>

          {/* Steg 3 */}
          <div className="relative h-64 rounded-2xl overflow-hidden">
            <img
              src="/Assets/ChatGPT Image 2 juni 2025 18_53_00.png"
              alt="Måltider levererade till dig"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 hover:bg-black/40 transition-all duration-300 rounded-2xl" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <h3 className="font-heading text-2xl font-semibold mb-2 text-white">
                Måltider levererade till dig
              </h3>
              <p className="text-white">
                Bekväm hemleverans direkt till din dörr
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
