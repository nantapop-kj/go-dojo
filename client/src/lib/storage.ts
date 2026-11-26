import type { StorageKey } from '@/enums';

const memory = new Map<string, string>();

const parseOr = <Value>(text: string | null | undefined, fallback: Value): Value => {
  return text ? (JSON.parse(text) as Value) : fallback;
};

const getItem = <Value>(key: StorageKey, fallback: Value): Value => {
  try {
    return parseOr(localStorage.getItem(key), fallback);
  } catch {
    return parseOr(memory.get(key), fallback);
  }
};

const setItem = (key: StorageKey, value: unknown): void => {
  const text = JSON.stringify(value);

  try {
    localStorage.setItem(key, text);
  } catch {
    memory.set(key, text);
  }
};

const removeItem = (key: StorageKey): void => {
  try {
    localStorage.removeItem(key);
  } catch {
    memory.delete(key);
  }
};

export const storage = {
  get: getItem,
  set: setItem,
  remove: removeItem,
};
