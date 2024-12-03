import {} from "date-fns";

export const convertDate = (date: Date | null) => {
  if (!date) return null;
  const humanReadableDate = new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return humanReadableDate;
};
