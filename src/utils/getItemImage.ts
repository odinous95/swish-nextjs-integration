import { mealsMap, SAUCES } from "@/data";
import {
  extraProteinBars,
  extraProteinMeals,
} from "@/global-ui/meals/MealData";

/** Returnerar korrekt bild‐URL för ett cartItem */
export const getItemImage = (itemId: string, itemName: string): string => {
  if (itemId === "citron" || itemName.toLowerCase().includes("citron")) {
    return "https://i.ibb.co/sd9w9Gbb/lemon-slice-693588-417-removebg-preview.png";
  }
  const shake = extraProteinMeals.find((s) => s.id === itemId);
  if (shake) return shake.image;
  const bar = extraProteinBars.find((b) => b.id === itemId);
  if (bar) return bar.image;
  if (itemId.startsWith("extra-")) {
    const extras: Record<string, string> = {
      "extra-spett":
        "https://i.ibb.co/q3T4kYKP/IMAGE-2025-04-15-20-30-25-removebg-preview.png",
      "extra-cevapcici":
        "https://i.ibb.co/yczRd1nS/IMAGE-2025-04-15-20-33-24-removebg-preview.png",
      "extra-sriracha":
        "https://i.ibb.co/WWhwHxX7/IMAGE-2025-04-20-23-09-10-removebg-preview.png",
      "extra-vitlok":
        "https://i.ibb.co/yFYBcDQN/IMAGE-2025-04-20-23-10-16-removebg-preview.png",
      "extra-ayran":
        "https://i.ibb.co/k6wgvh98/IMAGE-2025-04-20-22-43-10-removebg-preview.png",
    };
    return extras[itemId] || "";
  }

  if (mealsMap[itemId]) return mealsMap[itemId];
  const sauce = SAUCES.find((s) => s.id === itemId);
  if (sauce) return sauce.icon;
  return "";
};
