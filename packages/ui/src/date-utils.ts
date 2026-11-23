/**
 * Date utilities for Cambodia timezone (UTC+7)
 * Cambodia uses Indochina Time (ICT) which is UTC+7
 */

const CAMBODIA_TIMEZONE = "Asia/Phnom_Penh";

/**
 * Convert a date to Cambodia timezone
 * @param date - The date to convert
 * @returns Date in Cambodia timezone
 */
export const toCambodiaDate = (date: Date | string): Date => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Create a new date in Cambodia timezone
  return new Date(
    dateObj.toLocaleString("en-US", { timeZone: CAMBODIA_TIMEZONE })
  );
};

/**
 * Format date for Cambodia timezone display
 * @param date - The date to format
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatCambodiaDate = (
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: CAMBODIA_TIMEZONE,
  }
): string => {
  return date.toLocaleDateString("en-US", options);
};

/**
 * Normalize date to start of day in Cambodia timezone
 * @param date - The date to normalize
 * @returns Date at start of day in Cambodia timezone
 */
export const normalizeToCambodiaStartOfDay = (date: Date): Date => {
  const cambodiaDate = toCambodiaDate(date);
  return new Date(
    cambodiaDate.getFullYear(),
    cambodiaDate.getMonth(),
    cambodiaDate.getDate()
  );
};
