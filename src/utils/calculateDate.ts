import { format, addDays, isAfter } from "date-fns";
// Number of future days to consider for delivery
const DELIVERY_WINDOW_DAYS = 14;

// Determine the first valid delivery date
const now = new Date();
const cutoffToday = new Date(`${format(now, "yyyy-MM-dd")}T20:00`);
const startDate = isAfter(now, cutoffToday) ? addDays(now, 2) : addDays(now, 1);

// Helper to check if date is Mon–Fri
const isWeekday = (date: Date) => {
  const day = date.getDay(); // 0=Sun, 6=Sat
  return day >= 1 && day <= 5;
};

// Generate dynamic options
export const generateDeliveryOptions = () => {
  const options = [];

  for (let i = 0; i < DELIVERY_WINDOW_DAYS; i++) {
    const date = addDays(startDate, i);

    if (isWeekday(date)) {
      const dateStr = format(date, "yyyy-MM-dd");
      const labelDate = format(date, "EEEE d/M"); // You can use sv locale if needed

      options.push({
        label: `${labelDate} (18:00 – 22:00)`,
        value: `${dateStr}|18:00 – 22:00`,
      });
    }
  }

  return options;
};
