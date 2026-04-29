export type AppearancePreference = 'light' | 'dark' | 'system';

/** Default when no value is stored — follow OS light/dark via `preference === 'system'`. */
export const DEFAULT_APPEARANCE_PREFERENCE: AppearancePreference = 'system';
