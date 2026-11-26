import { useContext } from 'react';
import { PreferencesContext, type PreferencesContextValue } from '@/context/PreferencesContext';

export const usePreferences = (): PreferencesContextValue => {
  const value = useContext(PreferencesContext);

  if (!value) {
    throw new Error('usePreferences must be used inside <PreferencesProvider>');
  }

  return value;
};
