/**
 * Date Helper Functions
 * Utility functions for date formatting and manipulation
 */

/**
 * Format ISO date to readable format
 * @example "2026-05-20T06:49:10.254686Z" -> "May 20, 2026"
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format ISO date with time
 * @example "2026-05-20T06:49:10.254686Z" -> "May 20, 2026 6:49 AM"
 */
export function formatDateTime(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format date range
 * @example formatDateRange("2026-05-05T...", "2026-05-20T...") -> "May 5 - May 20, 2026"
 */
export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startFormatted = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const endFormatted = end.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${startFormatted} - ${endFormatted}`;
}

/**
 * Get relative time (e.g., "2 days ago", "in 3 hours")
 */
export function getRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffSecs = Math.round(diffMs / 1000);
  const diffMins = Math.round(diffSecs / 60);
  const diffHours = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHours / 24);

  if (Math.abs(diffSecs) < 60) {
    return diffSecs < 0 ? "just now" : "in a moment";
  }

  if (Math.abs(diffMins) < 60) {
    return diffMins < 0 ? `${Math.abs(diffMins)}m ago` : `in ${diffMins}m`;
  }

  if (Math.abs(diffHours) < 24) {
    return diffHours < 0 ? `${Math.abs(diffHours)}h ago` : `in ${diffHours}h`;
  }

  if (Math.abs(diffDays) < 30) {
    return diffDays < 0 ? `${Math.abs(diffDays)}d ago` : `in ${diffDays}d`;
  }

  return formatDate(isoDate);
}

/**
 * Check if date is in the past
 */
export function isPast(isoDate: string): boolean {
  return new Date(isoDate) < new Date();
}

/**
 * Check if date is in the future
 */
export function isFuture(isoDate: string): boolean {
  return new Date(isoDate) > new Date();
}

/**
 * Get days between two dates
 */
export function getDaysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Get days until date
 */
export function getDaysUntil(isoDate: string): number {
  const date = new Date(isoDate);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Format duration (e.g., "5 days", "2 weeks")
 */
export function formatDuration(days: number): string {
  if (days < 0) {
    return `${Math.abs(days)} days ago`;
  }

  if (days === 0) {
    return "Today";
  }

  if (days === 1) {
    return "Tomorrow";
  }

  if (days < 7) {
    return `${days} days`;
  }

  const weeks = Math.floor(days / 7);
  if (weeks === 1) {
    return "1 week";
  }

  if (weeks < 4) {
    return `${weeks} weeks`;
  }

  const months = Math.floor(days / 30);
  if (months === 1) {
    return "1 month";
  }

  return `${months} months`;
}

/**
 * Get time remaining until expiry
 */
export function getTimeRemaining(expiryDate: string): string {
  const daysUntil = getDaysUntil(expiryDate);

  if (daysUntil < 0) {
    return "Expired";
  }

  return formatDuration(daysUntil);
}

/**
 * Check if date is within range
 */
export function isDateInRange(date: string, startDate: string, endDate: string): boolean {
  const d = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);
  return d >= start && d <= end;
}

/**
 * Format date for input field (YYYY-MM-DD)
 */
export function formatDateForInput(isoDate: string): string {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Parse date from input field
 */
export function parseDateFromInput(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Get start of day
 */
export function getStartOfDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get end of day
 */
export function getEndOfDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Get start of month
 */
export function getStartOfMonth(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get end of month
 */
export function getEndOfMonth(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  d.setHours(23, 59, 59, 999);
  return d;
}
