/**
 * Date Formatting Utilities
 * Consistent date formatting across the application
 * Format: DD/MM/YYYY per Guidelines.md
 */

/**
 * Format a date string to DD/MM/YYYY format
 * @param dateString - ISO date string or null
 * @returns Formatted date string or "No expiry" if null
 */
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return "No expiry";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Calculate days until expiry from a given date
 * @param expiryDate - ISO date string or null
 * @returns Number of days until expiry, or null if no expiry
 */
export const getDaysUntilExpiry = (expiryDate: string | null): number | null => {
  if (!expiryDate) return null;
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Get current date in YYYY-MM-DD format (for input fields)
 */
export const getTodayString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

/**
 * Parse DD/MM/YYYY string to ISO date string
 * @param dateString - Date in DD/MM/YYYY format
 * @returns ISO date string (YYYY-MM-DD)
 */
export const parseDDMMYYYY = (dateString: string): string => {
  const [day, month, year] = dateString.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};
