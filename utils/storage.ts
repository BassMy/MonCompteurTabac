import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, AppSettings } from '@/types';

const STORAGE_KEYS = {
  APP_STATE: 'cigarette_app_state',
  SETTINGS: 'cigarette_app_settings',
};

const DEFAULT_SETTINGS: AppSettings = {
  initialDelay: 120, // 2 heures
  incrementDelay: 5, // 5 minutes
  notificationsEnabled: true,
};

export const StorageService = {
  async saveAppState(state: AppState): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.APP_STATE, JSON.stringify(state));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  },

  async loadAppState(): Promise<AppState | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.APP_STATE);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      return null;
    }
  },

  async saveSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
    }
  },

  async loadSettings(): Promise<AppSettings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
      return DEFAULT_SETTINGS;
    }
  },

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.APP_STATE, STORAGE_KEYS.SETTINGS]);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  },
};