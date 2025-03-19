
export interface Player {
  id: string;
  name: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  isAdmin: boolean;
}

export interface Game {
  id: string;
  date: string;
  location: string;
  maxPlayers: number;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface GamePlayer {
  id: string;
  gameId: string;
  playerId: string;
  playerName: string;
  playerGender: 'male' | 'female' | 'other';
  hasPaid: boolean;
}

export interface Team {
  id: number;
  players: GamePlayer[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  isAdmin: boolean;
}

export type TeamSize = 3 | 4;
