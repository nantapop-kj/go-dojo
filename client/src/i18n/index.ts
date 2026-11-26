import { Language } from '@/enums';
import { EnglishStrings } from '@/i18n/english';
import { ThaiStrings, type StringKey } from '@/i18n/thai';
import type { TranslationVariables } from '@/types';

export type { StringKey };

export const Dictionaries: Record<Language, Record<StringKey, string>> = {
  [Language.Thai]: ThaiStrings,
  [Language.English]: EnglishStrings,
};

export const formatTemplate = (template: string, variables?: TranslationVariables): string => {
  if (!variables) return template;

  return template.replace(/\{(\w+)\}/g, (placeholder: string, name: string): string => {
    return String(variables[name] ?? placeholder);
  });
};

export const getText = (
  language: Language,
  key: StringKey,
  variables?: TranslationVariables,
): string => {
  return formatTemplate(Dictionaries[language][key], variables);
};
