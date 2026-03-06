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
