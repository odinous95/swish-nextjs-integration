"use client";
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { faqItems } from '@/data';


export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };



  return (
    <div className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-center mb-4 animate-letter-spacing text-transparent bg-gradient-to-r from-[#FFD54F] to-[#FFB300] bg-clip-text">
          Vanliga Frågor
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Har du fler frågor? Kontakta oss på <strong>support@healthyeating.se</strong>
        </p>
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <button
                className="w-full px-6 py-4 text-left bg-white flex justify-between items-center"
                onClick={() => toggleQuestion(index)}
              >
                <span className="font-heading font-semibold text-lg text-gray-900">
                  {item.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              <div
                className={`px-6 transition-all duration-300 overflow-hidden ${openIndex === index ? 'py-4' : 'max-h-0'
                  }`}
              >
                <p className="text-gray-600 whitespace-pre-line" dangerouslySetInnerHTML={{ __html: item.answer }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
