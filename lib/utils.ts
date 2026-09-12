import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(time24: string) {
  if (!time24) return "";
  const parts = time24.split(":");
  if (parts.length < 2) return time24;
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes)) return time24;

  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
}

export const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    Sports: "#FF4D4D", // Electric Crimson / Coral Red
    Music: "#A855F7", // Neon Purple
    Community: "#F43F5E", // Radiant Hot Pink / Rose
    Learning: "#38BDF8", // Electric Sky Blue
    "Food & Drink": "#FBBF24", // Radiant Amber Gold
    Tech: "#06B6D4", // Electric Cyan
    "Arts & Culture": "#FB7185", // Electric Coral / Salmon
    Outdoors: "#10B981", // Vivid Emerald Green
    "🖥️ Virtual": "#8B5CF6", // Electric Violet
    Recommended: "#F59E0B", // Amber
    Joined: "#3B82F6", // Electric Blue
    default: "#94A3B8", // Bright Slate
  }
  return colors[category] || colors.default
}

/**
 * Canonical "is this event happening right now?" check.
 * Used by BOTH the Home happeningNow section and the Map Live filter chip
 * to guarantee consistent counts.
 *
 * Delegates to the timezone-aware isEventLiveTZ() from lib/datetime
 * which properly interprets event times in the event's stored timezone.
 */
export { isEventLiveTZ as isEventLive } from '@/lib/datetime';
