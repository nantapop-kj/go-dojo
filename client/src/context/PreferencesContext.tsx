import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type JSX,
  type ReactNode,
} from 'react';
import { DefaultGameSettings } from '@/constants/defaults';
import { Language, StorageKey } from '@/enums';
import { storage } from '@/lib/storage';
import type { Preferences } from '@/types';

export interface PreferencesContextValue {
  preferences: Preferences;
  updatePreferences: (changes: Partial<Preferences>) => void;
}

interface PreferencesProviderProps {
  children: ReactNode;
}

export const PreferencesContext = createContext<PreferencesContextValue | null>(null);

const getInitialPreferences = (): Preferences => {
  const prefersThai = navigator.language.startsWith('th');

  return {
    language: prefersThai ? Language.Thai : Language.English,
    showLegal: true,
    showTerritory: false,
    showCoordinates: true,
    lastGameSettings: DefaultGameSettings,
    ...storage.get<Partial<Preferences>>(StorageKey.Preferences, {}),
  };
};

export const PreferencesProvider = ({ children }: PreferencesProviderProps): JSX.Element => {
  const [preferences, setPreferences] = useState<Preferences>(getInitialPreferences);

  useEffect((): void => {
    storage.set(StorageKey.Preferences, preferences);
    document.documentElement.lang = preferences.language;
  }, [preferences]);

  const updatePreferences = useCallback((changes: Partial<Preferences>): void => {
    setPreferences((current: Preferences): Preferences => ({ ...current, ...changes }));
  }, []);

  const value = useMemo(
    (): PreferencesContextValue => ({ preferences, updatePreferences }),
    [preferences, updatePreferences],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};
