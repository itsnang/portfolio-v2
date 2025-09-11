import { formatCambodiaDate } from "@/lib/date-utils";

export const convertDate = (date: Date | null) => {
  if (!date) return null;
  return formatCambodiaDate(date, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
