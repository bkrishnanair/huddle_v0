export interface Player {
  id: string;
  displayName: string;
  photoURL?: string;
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
  players: string[];
  playerDetails?: Player[];
  checkedInPlayers?: string[];
  distance?: number;
  isBoosted?: boolean;
  isPrivate?: boolean;
}
