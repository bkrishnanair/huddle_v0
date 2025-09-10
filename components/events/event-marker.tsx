
import { GameEvent } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Dribbble,
  Bike,
  Dumbbell,
  Footprints,
  LucideProps,
  PersonStanding,
  Football, // Corrected: Futbol -> Football
  Swords,
  Users,
  Webhook,
} from "lucide-react";
import React from "react";

// Mapping of sports to Lucide icons
const sportIconMap: Record<string, React.FC<LucideProps>> = {
  basketball: Dribbble,
  volleyball: Football,
  soccer: Football,
  football: Football,
  running: Footprints,
  tennis: Dumbbell,
  pickleball: Dumbbell,
  golf: Dumbbell,
  gym: Dumbbell,
  frisbee: Webhook,
  skateboarding: Bike,
  cycling: Bike,
  bowling: Dumbbell,
  other: Users,
};

interface EventMarkerProps {
  event: GameEvent;
  zoom: number;
  onClick?: () => void;
}

const EventMarker: React.FC<EventMarkerProps> = ({ event, zoom, onClick }) => {
  const { sport, players, maxPlayers, isBoosted } = event;

  // Determine the correct icon for the sport
  const IconComponent = sportIconMap[sport.toLowerCase()] || Users;

  // Calculate the "fullness" of the event
  const fullness = Math.min((players?.length || 0) / maxPlayers, 1);

  // Define SVG circle properties for the progress ring
  const circleRadius = 24;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circleCircumference * (1 - fullness);

  // Define styles for boosted events
  const boostedGlow = isBoosted ? "drop-shadow-[0_0_8px_#ffcc00aa]" : "";

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative flex h-16 w-16 items-center justify-center rounded-full bg-background transition-all duration-300 cursor-pointer",
        boostedGlow
      )}
    >
      {/* SVG for the "fullness" ring */}
      <svg
        className="absolute h-full w-full -rotate-90 transform"
        viewBox="0 0 52 52"
      >
        <circle
          cx="26"
          cy="26"
          r={circleRadius}
          strokeWidth="4"
          className="stroke-muted"
          fill="transparent"
        />
        <circle
          cx="26"
          cy="26"
          r={circleRadius}
          strokeWidth="4"
          strokeDasharray={circleCircumference}
          strokeDashoffset={strokeDashoffset}
          className="stroke-primary transition-all duration-500"
          fill="transparent"
          strokeLinecap="round"
        />
      </svg>

      {/* Sport-specific icon */}
      <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-background">
        <IconComponent className="h-6 w-6 text-foreground" />
      </div>
    </div>
  );
};

export default EventMarker;
