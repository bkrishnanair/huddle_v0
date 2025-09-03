export interface Player {
  id: string;
  displayName: string;
  photoURL?: string;
}

export interface GameEvent {
  id: string;
  title: string;
  sport: string;
  location: any;
  latitude: number;
  longitude: number;
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
}
