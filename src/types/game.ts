export type Player = 'X' | 'O';
export type GameMode = 'player' | 'ai' | 'online';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameState {
  board: (Player | null)[];
  currentPlayer: Player;
  gameActive: boolean;
  scores: Record<Player, number>;
  playerNames: Record<Player, string>;
  roundNumber: number;
  winStreak: {
    player: Player | null;
    count: number;
  };
}

export interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string;
  wins: number;
  losses: number;
  draws: number;
  elo_rating: number;
}
