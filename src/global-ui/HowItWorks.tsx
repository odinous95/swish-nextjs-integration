import React from 'react';
import { MenuSquare, ChefHat, Truck } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: <MenuSquare className="w-16 h-16 text-yellow-500 mb-4" strokeWidth={1.5} />,
      title: 'Välj dina måltider',
      description: 'Välj bland våra näringsrika och välbalanserade måltider',
    },
    {
      icon: <ChefHat className="w-16 h-16 text-yellow-500 mb-4" strokeWidth={1.5} />,
      title: 'Vi lagar och packar färskt',
      description: 'Våra kockar tillagar din mat med färska råvaror',
    },
    {
      icon: <Truck className="w-16 h-16 text-yellow-500 mb-4" strokeWidth={1.5} />,
      title: 'Måltider levererade till dig',
      description: 'Bekväm hemleverans direkt till din dörr',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-6 bg-gradient-to-b from-yellow-50 to-white text-gray-900">
      <div className="max-w-7xl mx-auto relative">
        <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-center text-yellow-600 mb-20 tracking-tight">
          Hälsosam Mat – På Ett Enkelt Sätt
        </h2>

        {/* Horizontal Line Through Cards (Desktop only) */}
        <div className="hidden md:block absolute top-1/2 left-0 right-0 z-0">
          <div className="max-w-6xl mx-auto h-1 bg-yellow-300 relative">
            {/* Circle indicators */}
            <div className="absolute top-1/2 left-[16.6%] transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white border-4 border-yellow-500 rounded-full" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white border-4 border-yellow-500 rounded-full" />
            <div className="absolute top-1/2 right-[16.6%] transform translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white border-4 border-yellow-500 rounded-full" />
          </div>
        </div>

        {/* Cards */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 z-10">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center px-6 py-10 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              {step.icon}
              <h3 className="font-heading text-2xl font-semibold mb-2 text-yellow-700">
                {step.title}
              </h3>
              <p className="text-gray-600 max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
