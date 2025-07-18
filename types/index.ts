export interface CigaretteRecord {
  id: string;
  timestamp: number;
  forced?: boolean;
}

export interface AppSettings {
  initialDelay: number; // en minutes
  incrementDelay: number; // en minutes
  notificationsEnabled: boolean;
}

export interface AppState {
  lastCigaretteTime: number | null;
  nextAllowedTime: number | null;
  currentDelay: number;
  cigaretteCount: number;
  records: CigaretteRecord[];
  settings: AppSettings;
}

export interface DailyStats {
  date: string;
  count: number;
  averageInterval: number;
}