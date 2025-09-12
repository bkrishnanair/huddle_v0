export interface Player {
  id: string;
  displayName: string;
  photoURL?: string;
}

export interface HuddleEvent {
  id: string;
  name: string;
  category: string;
  tags?: string[];
  venue: any;
  geopoint: {
    latitude: number;
    longitude: number;
  };
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
