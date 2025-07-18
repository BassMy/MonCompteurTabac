import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, AppSettings, CigaretteRecord } from '@/types';
import { StorageService } from '@/utils/storage';
import { CigaretteLogic } from '@/utils/cigarette-logic';
import { NotificationService } from '@/utils/notifications';

interface AppContextType {
  state: AppState;
  addCigarette: (forced?: boolean) => void;
  updateSettings: (settings: AppSettings) => void;
  resetApp: () => void;
  remainingTime: number;
  canSmoke: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

type Action =
  | { type: 'SET_STATE'; payload: AppState }
  | { type: 'ADD_CIGARETTE'; payload: { forced: boolean } }
  | { type: 'UPDATE_SETTINGS'; payload: AppSettings }
  | { type: 'RESET_APP' }
  | { type: 'TICK' };

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;
      
    case 'ADD_CIGARETTE':
      return CigaretteLogic.addCigarette(state, action.payload.forced);
      
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: action.payload,
      };
      
    case 'RESET_APP':
      return CigaretteLogic.createInitialState(state.settings);
      
    case 'TICK':
      return { ...state };
      
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, {} as AppState);
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Initialisation
  useEffect(() => {
    const initialize = async () => {
      try {
        const settings = await StorageService.loadSettings();
        const savedState = await StorageService.loadAppState();
        
        if (savedState) {
          dispatch({ type: 'SET_STATE', payload: { ...savedState, settings } });
        } else {
          dispatch({ type: 'SET_STATE', payload: CigaretteLogic.createInitialState(settings) });
        }
        
        await NotificationService.requestPermissions();
        setIsInitialized(true);
      } catch (error) {
        console.error('Erreur d\'initialisation:', error);
        setIsInitialized(true);
      }
    };

    initialize();
  }, []);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Sauvegarde
  useEffect(() => {
    if (isInitialized && state.records) {
      StorageService.saveAppState(state);
    }
  }, [state, isInitialized]);

  const addCigarette = async (forced: boolean = false) => {
    dispatch({ type: 'ADD_CIGARETTE', payload: { forced } });
    
    if (state.settings.notificationsEnabled) {
      const newDelay = state.currentDelay + state.settings.incrementDelay;
      await NotificationService.scheduleNextCigaretteNotification(newDelay);
    }
  };

  const updateSettings = async (settings: AppSettings) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
    await StorageService.saveSettings(settings);
  };

  const resetApp = async () => {
    dispatch({ type: 'RESET_APP' });
    await NotificationService.cancelAllNotifications();
  };

  const remainingTime = CigaretteLogic.getRemainingTime(state);
  const canSmoke = CigaretteLogic.canSmoke(state);

  if (!isInitialized) {
    return null; // Ou un écran de chargement
  }

  return (
    <AppContext.Provider
      value={{
        state,
        addCigarette,
        updateSettings,
        resetApp,
        remainingTime,
        canSmoke,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}