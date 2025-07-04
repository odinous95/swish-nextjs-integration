import React from "react";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  text: string;
}

const StarRating = () => (
  <div className="flex gap-1 mb-2">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className="w-5 h-5 text-yellow-400"
        fill="currentColor"
        stroke="currentColor"
      />
    ))}
  </div>
);

const TestimonialCard: React.FC<TestimonialCardProps> = ({ name, text }) => {
  return (
    // Yttre wrapper ger gradient‐ram på 1px
    <div className="rounded-xl bg-gradient-to-r from-[#FFD54F] to-[#FFB300] p-[1px] shadow-[0_8px_30px_rgb(0,0,0,0.15)] h-full">
      {/* Inre kortyta med solid bakgrund */}
      <div className="bg-neutral-800 rounded-xl p-6 h-full flex flex-col">
        <div className="flex items-center mb-4">
          <h3 className="font-heading font-semibold text-white">{name}</h3>
        </div>
        <StarRating />
        <p className="text-gray-300">{text}</p>
      </div>
    </div>
  );
};

export default TestimonialCard;
