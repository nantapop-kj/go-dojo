export const StorageKey = {
  Preferences: 'go-dojo:preferences:v1',
} as const;

export type StorageKey = (typeof StorageKey)[keyof typeof StorageKey];
