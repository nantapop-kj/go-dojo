import { useCallback } from 'react';
import type { Language } from '@/enums';
import { usePreferences } from '@/hooks/usePreferences';
import { getText, type StringKey } from '@/i18n';
import type { TranslationVariables } from '@/types';

type Translate = (key: StringKey, variables?: TranslationVariables) => string;

interface Translation {
  translate: Translate;
  language: Language;
}

export const useTranslation = (): Translation => {
  const { preferences } = usePreferences();
  const { language } = preferences;

  const translate = useCallback(
    (key: StringKey, variables?: TranslationVariables): string => {
      return getText(language, key, variables);
    },
    [language],
  );

  return { translate, language };
};
