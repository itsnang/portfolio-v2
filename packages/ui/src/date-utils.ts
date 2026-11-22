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
 * Create a date at midnight in Cambodia timezone
 * @param year - The year
 * @param month - The month (0-11)
 * @param day - The day
 * @returns Date at midnight in Cambodia timezone
 */
export const createCambodiaDate = (
  year: number,
  month: number,
  day: number
): Date => {
  // Create date in Cambodia timezone
  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const date = new Date(dateStr + "T00:00:00+07:00");
  return date;
};

/**
 * Get current date in Cambodia timezone
 * @returns Current date in Cambodia timezone
 */
export const getCurrentCambodiaDate = (): Date => {
  return toCambodiaDate(new Date());
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
 * Check if a date is today in Cambodia timezone
 * @param date - The date to check
 * @returns True if the date is today in Cambodia timezone
 */
export const isTodayInCambodia = (date: Date): boolean => {
  const today = getCurrentCambodiaDate();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
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

/**
 * Normalize date to end of day in Cambodia timezone
 * @param date - The date to normalize
 * @returns Date at end of day in Cambodia timezone
 */
export const normalizeToCambodiaEndOfDay = (date: Date): Date => {
  const cambodiaDate = toCambodiaDate(date);
  return new Date(
    cambodiaDate.getFullYear(),
    cambodiaDate.getMonth(),
    cambodiaDate.getDate(),
    23,
    59,
    59,
    999
  );
};
