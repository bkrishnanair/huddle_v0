import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { GameEvent } from "@/lib/types"

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
    Sports: "#E74C3C", // Red Line
    Music: "#9B59B6", // Purple Line
    Community: "#EC407A", // Lighter Pink
    Learning: "#3498DB", // Sky Blue
    "Food & Drink": "#F39C12", // Gold Line
    Tech: "#00796B", // Deeper Teal/Green
    "Arts & Culture": "#C0392B", // Strong Red
    Outdoors: "#2ECC71", // Emerald Green
    "🖥️ Virtual": "#8E44AD", // Dark Purple
    Recommended: "#f59e0b", // Amber
    Joined: "#3b82f6", // Blue
    default: "#64748b", // Slate
  }
  return colors[category] || colors.default
}

/**
 * Canonical "is this event happening right now?" check.
 * Used by BOTH the Home happeningNow section and the Map Live filter chip
 * to guarantee consistent counts.
 *
 * Logic:
 *   - Event has started (now >= start)
 *   - Event has NOT ended. If endTime is set, use it; otherwise default to 2 hours after start.
 *   - Skips archived/past events.
 */
export function isEventLive(event: GameEvent): boolean {
  if (event.status === 'archived' || event.status === 'past') return false;
  if (!event.date || !event.time) return false;

  try {
    const start = new Date(`${event.date}T${event.time}`);
    if (isNaN(start.getTime())) return false;

    const now = new Date();
    if (now < start) return false;

    // Use endTime if available; otherwise default to start + 2 hours
    let end: Date;
    if (event.endTime) {
      end = new Date(`${event.endDate || event.date}T${event.endTime}`);
      if (isNaN(end.getTime())) {
        end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
      }
    } else {
      end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    }

    return now <= end;
  } catch {
    return false;
  }
}
