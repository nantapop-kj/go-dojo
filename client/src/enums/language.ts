export const Language = {
  Thai: 'th',
  English: 'en',
} as const;

export type Language = (typeof Language)[keyof typeof Language];
