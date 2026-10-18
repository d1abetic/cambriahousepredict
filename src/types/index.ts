export interface House {
  id: string;
  name: string;
  city: string;
  icon: string;
  color: string;
  silver: number;
  players: number;
  guilds: number;
  totalRevealed?: number;
  timesRenounced?: number;
  consistentStreak?: number;
  treasury: string;
  netWorth: string;
  topGuild: string;
  guildList: string[];
  lore: string;
  image?: string;
}

export interface Prediction {
  houseId: string;
  amount: number;
  timestamp?: number;
}

export type SortCriteria = 'silver' | 'players' | 'name';

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
