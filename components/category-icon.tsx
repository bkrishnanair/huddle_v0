import {
  Code2,
  GraduationCap,
  MapPin,
  Music2,
  Palette,
  Trees,
  Trophy,
  Users,
  Utensils,
  type LucideIcon,
} from "lucide-react";

const categoryIcons: Record<string, LucideIcon> = {
  Sports: Trophy,
  Music: Music2,
  Community: Users,
  Learning: GraduationCap,
  "Food & Drink": Utensils,
  Tech: Code2,
  "Arts & Culture": Palette,
  Outdoors: Trees,
};

export function CategoryIcon({
  category,
  className = "h-5 w-5",
}: {
  category: string;
  className?: string;
}) {
  const Icon = categoryIcons[category] || MapPin;
  return <Icon className={className} aria-hidden="true" />;
}
