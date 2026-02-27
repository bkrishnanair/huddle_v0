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
  tags?: string[];
  venue: any;
  location?: any; // Alias for venue
  geopoint: {
    latitude: number;
    longitude: number;
  };
  description?: string;
  date: string;
  time: string;
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
}
