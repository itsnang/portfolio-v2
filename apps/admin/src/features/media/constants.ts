export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ACCEPTED_IMAGE_TYPES = {
  "image/png": [],
  "image/jpeg": [],
  "image/jpg": [],
  "image/webp": [],
  "image/jfif": [],
} as const;

/** The size rule for every upload: the reason it's too large, or null when it fits. */
export function fileTooLargeMessage(size: number): string | null {
  if (size <= MAX_FILE_SIZE) return null;
  const mb = (bytes: number) => (bytes / (1024 * 1024)).toFixed(1).replace(/\.0$/, "");
  return `File is too large (${mb(size)}MB). Max is ${mb(MAX_FILE_SIZE)}MB.`;
}
