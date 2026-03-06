export interface Player {
  id: string;
  displayName: string;
  photoURL?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  bio?: string;
  photoURL?: string;
  savedQuestions?: string[];
  savedTransitTips?: string[];
}

export interface GameEvent {
  id: string;
  name: string;
  title?: string; // Alias for name
  category: string;
  sport?: string; // Alias for category
  eventType?: "in-person" | "virtual" | "hybrid"; // default: "in-person"
  virtualLink?: string | null; // URL to Zoom/Meet/Teams/custom link
  icon?: string;
  tags?: string[];
  venue: any;
  location?: any; // Alias for venue
  geopoint: {
    latitude: number;
    longitude: number;
  };
  description?: string;
  orgLocation?: string;
  orgGeopoint?: {
    latitude: number;
    longitude: number;
  };
  date: string;
  endDate?: string;
  time: string;
  endTime?: string;
  maxPlayers: number;
  currentPlayers: number;
  createdBy: string;
  organizerName: string;
  organizerPhotoURL?: string;
  pinnedMessage?: string;
  players: string[];
  waitlist?: string[];
  attendeeNotes?: Record<string, string>;
  attendeeAnswers?: Record<string, Record<string, string>>;
  attendeePickup?: Record<string, string>;
  questions?: string[];
  pickupPoints?: { id: string; location: string; time: string }[];
  stayUntil?: string;
  transitTips?: string;
  playerDetails?: Player[];
  checkedInPlayers?: string[];
  checkIns?: Record<string, boolean>;
  distance?: number;
  isBoosted?: boolean;
  isPrivate?: boolean;
  scheduledMessages?: {
    id: string;
    message: string;
    scheduledFor: string; // ISO String
    sent: boolean;
    isAnnouncement: boolean; // if true, pin it when sent
  }[];
  status?: "active" | "past"; // To allow organizers to explicitly close events
  checkInOpen?: boolean;
  createdAt?: any;
  parentEventId?: string;
  recurrence?: {
    type: "weekly" | "biweekly" | "monthly";
    endDate: string;
  };
}

export interface AppNotification {
  id: string;
  userId: string;
  type: "waitlist_promo" | "event_update" | "event_announcement" | "general" | "rsvp_update";
  message: string;
  eventId?: string;
  read: boolean;
  createdAt: string; // ISO String
}
