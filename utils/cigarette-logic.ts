import { CigaretteRecord, AppState, AppSettings } from '@/types';

export const CigaretteLogic = {
  createInitialState(settings: AppSettings): AppState {
    return {
      lastCigaretteTime: null,
      nextAllowedTime: null,
      currentDelay: settings.initialDelay,
      cigaretteCount: 0,
      records: [],
      settings,
    };
  },

  canSmoke(state: AppState): boolean {
    if (!state.nextAllowedTime) return true;
    return Date.now() >= state.nextAllowedTime;
  },

  getRemainingTime(state: AppState): number {
    if (!state.nextAllowedTime) return 0;
    const remaining = state.nextAllowedTime - Date.now();
    return Math.max(0, remaining);
  },

  addCigarette(state: AppState, forced: boolean = false): AppState {
    const now = Date.now();
    const newRecord: CigaretteRecord = {
      id: `${now}_${Math.random()}`,
      timestamp: now,
      forced,
    };

    const newDelay = state.currentDelay + state.settings.incrementDelay;
    const nextAllowedTime = now + (newDelay * 60 * 1000);

    return {
      ...state,
      lastCigaretteTime: now,
      nextAllowedTime,
      currentDelay: newDelay,
      cigaretteCount: state.cigaretteCount + 1,
      records: [...state.records, newRecord],
    };
  },

  formatTime(milliseconds: number): string {
    const totalMinutes = Math.floor(milliseconds / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return `${hours}h ${minutes.toString().padStart(2, '0')}min`;
    }
    return `${minutes}min`;
  },

  getTodaysStats(records: CigaretteRecord[]) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();
    const todayEnd = todayStart + (24 * 60 * 60 * 1000);

    const todaysRecords = records.filter(
      record => record.timestamp >= todayStart && record.timestamp < todayEnd
    );

    return {
      count: todaysRecords.length,
      records: todaysRecords,
    };
  },

  getWeekStats(records: CigaretteRecord[]) {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekRecords = records.filter(
      record => record.timestamp >= weekStart.getTime()
    );

    return {
      count: weekRecords.length,
      records: weekRecords,
    };
  },
};