import { addDays, isAfter, format as formatDateFns } from "date-fns";

const DELIVERY_WINDOW_DAYS = 7; // Begränsat till 1 vecka framåt

// Hjälper till att göra första bokstaven i en sträng versal
function capitalizeFirst(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Hämtar veckodagens namn på svenska (i gemener), t.ex. "måndag"
function getSwedishWeekday(date: Date): string {
  return new Intl.DateTimeFormat("sv-SE", { weekday: "long" }).format(date);
}

export const generateDeliveryOptions = () => {
  const options: { label: string; value: string }[] = [];
  const now = new Date();

  // Bestäm om klockan är efter 20:00 idag
  const cutoffToday = new Date(`${formatDateFns(now, "yyyy-MM-dd")}T20:00`);
  const skipDays = isAfter(now, cutoffToday) ? 2 : 1;

  for (let i = skipDays; i < skipDays + DELIVERY_WINDOW_DAYS; i++) {
    const date = addDays(now, i);
    const dateStr = formatDateFns(date, "yyyy-MM-dd");

    // Veckodag på svenska (gemener), t.ex. "måndag"
    const weekdayLower = getSwedishWeekday(date);
    // Gör första bokstaven versal: "Måndag"
    const weekday = capitalizeFirst(weekdayLower);

    // Dag och månad, t.ex. "7/6"
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const datePart = `${day}/${month}`;

    // Etikett: "Veckodag D/M", t.ex. "Måndag 7/6"
    const labelDate = `${weekday} ${datePart}`;

    options.push({
      label: labelDate,
      value: dateStr,
    });
  }

  return options;
};
