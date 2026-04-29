import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';

import { defaultOnboardingData } from '~/lib/onboarding-types';

export const AUTH_STORAGE_KEY = '@atlas-mvp-vibes/auth';

/** Keep in sync with onboarding — reset on new sign-up (avoid importing onboarding from auth). */
const ONBOARDING_STORAGE_KEY = '@atlas-mvp-vibes/onboarding';

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
};

type AuthState = {
  user: AuthUser | null;
  /** False until AsyncStorage has been read */
  hydrated: boolean;
};

type AuthContextValue = AuthState & {
  signIn: (username: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  signUp: (email: string, fullName: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

/** Demo account: username `test`, password `test` — skips onboarding (handled in onboarding provider). */
export const MOCK_TEST_USERNAME = 'test';
export const MOCK_TEST_PASSWORD = 'test';

export const MOCK_TEST_USER: AuthUser = {
  id: 'mock-test-user',
  email: 'test@test.com',
  fullName: 'Test User',
};

/** Prefill sign-up (meets password rules: upper, lower, number, special, length). */
export const DEMO_SIGNUP_EMAIL = 'demo@example.com';
export const DEMO_SIGNUP_FULL_NAME = 'Demo User';
export const DEMO_SIGNUP_PASSWORD = 'Test123!';

/**
 * Whether the user may enter the main `(app)` area. Demo `test` / `test` skips onboarding
 * immediately (avoids a race where persisted onboarding says `completed: false` before sync).
 */
export function canAccessAppShell(user: AuthUser | null, onboardingCompleted: boolean): boolean {
  if (!user) return false;
  if (user.id === MOCK_TEST_USER.id) return true;
  return onboardingCompleted;
}

async function readStoredUser(): Promise<AuthUser | null> {
  try {
    const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (parsed?.id && parsed?.email && typeof parsed.fullName === 'string') {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return null;
}

async function writeStoredUser(user: AuthUser | null) {
  if (user) {
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    void readStoredUser().then((u) => {
      setUser(u);
      setHydrated(true);
    });
  }, []);

  const signIn = React.useCallback(async (username: string, password: string) => {
    const u = username.trim().toLowerCase();
    const p = password;
    if (u === MOCK_TEST_USERNAME && p === MOCK_TEST_PASSWORD) {
      await writeStoredUser(MOCK_TEST_USER);
      setUser(MOCK_TEST_USER);
      return { ok: true as const };
    }
    return { ok: false as const, error: 'Invalid credentials. Try username test and password test.' };
  }, []);

  const signUp = React.useCallback(async (email: string, fullName: string, _password: string) => {
    const newUser: AuthUser = {
      id: `user-${Date.now()}`,
      email: email.trim().toLowerCase(),
      fullName: fullName.trim(),
    };
    await writeStoredUser(newUser);
    await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(defaultOnboardingData));
    setUser(newUser);
  }, []);

  const signOut = React.useCallback(async () => {
    await writeStoredUser(null);
    setUser(null);
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      hydrated,
      signIn,
      signUp,
      signOut,
    }),
    [user, hydrated, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
