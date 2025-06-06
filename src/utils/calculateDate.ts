import { format, addDays, isAfter } from "date-fns";
import { sv } from "date-fns/locale";

const DELIVERY_WINDOW_DAYS = 7; // Begränsat till 1 vecka framåt

// Hjälpfunktion för att göra första bokstaven versal
function capitalizeFirst(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const generateDeliveryOptions = () => {
  const options: { label: string; value: string }[] = [];
  const now = new Date();

  // Bestäm om klockan är efter 20:00 idag – i så fall första leverans om två dagar
  const cutoffToday = new Date(`${format(now, "yyyy-MM-dd")}T20:00`);
  const skipDays = isAfter(now, cutoffToday) ? 2 : 1;

  for (let i = skipDays; i < skipDays + DELIVERY_WINDOW_DAYS; i++) {
    const date = addDays(now, i);
    const dateStr = format(date, "yyyy-MM-dd");

    // Formatera veckodag + datum på svenska (t.ex. "Måndag 9/6")
    const rawLabel = format(date, "EEEE d/M", { locale: sv });
    const labelDate = capitalizeFirst(rawLabel);

    // Skapa alternativ utan någon tid
    options.push({
      label: labelDate,
      value: dateStr,
    });
  }

  return options;
};
