import { format, addDays, isAfter } from "date-fns";

const DELIVERY_WINDOW_DAYS = 14;

export const generateDeliveryOptions = () => {
  const options = [];
  const now = new Date();

  // Determine if it's past 20:00 today
  const cutoffToday = new Date(`${format(now, "yyyy-MM-dd")}T20:00`);
  const skipDays = isAfter(now, cutoffToday) ? 2 : 1;

  for (let i = skipDays; i < skipDays + DELIVERY_WINDOW_DAYS; i++) {
    const date = addDays(now, i);
    const dateStr = format(date, "yyyy-MM-dd");
    const labelDate = format(date, "EEEE d/M"); // Add locale if needed

    options.push({
      label: `${labelDate} (18:00 – 22:00)`,
      value: `${dateStr}|18:00 – 22:00`,
    });
  }

  return options;
};
