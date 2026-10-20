export type MarketChamber = 'crown' | 'regional' | 'freeborn';

export interface House {
  id: string;
  name: string;
  city: string;
  homeCity?: string;
  icon: string;
  color: string;
  silver: number;
  players: number;
  guilds: number;
  totalRevealed?: number;
  viceroys?: number;
  primaryAffinity?: string;
  timesRenounced?: number;
  consistentStreak?: number;
  treasury: string;
  netWorth: string;
  topGuild: string;
  guildList: string[];
  lore: string;
  image?: string;
}

export interface RegionalCityInfluence {
  houseId: string;
  houseName: string;
  percentage: number;
  silverBurned: number;
}

export interface RegionalCity {
  id: string;
  name: string;
  region: string;
  theme: string;
  icon: string;
  tacticalLore: string;
  leadingHouseId: string;
  influenceBreakdown: RegionalCityInfluence[];
  totalSilverBurned: number;
  riskLevel: 'T5 High-Risk' | 'Tier 4 Wilderness' | 'Crown Protected';
}

export interface FreebornUpsetOption {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  multiplier: number;
  totalSilverBurned: number;
  icon: string;
  targetFaction?: string;
}

export interface MarketPrediction {
  id: string;
  chamber: MarketChamber;
  targetId: string;
  targetName: string;
  chamberTitle: string;
  amount: number;
  multiplier: number;
  potentialPayout: number;
  timestamp: number;
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
