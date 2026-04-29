import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';

import {
  defaultOnboardingData,
  mergeRehydration,
  normalizeLifeEventList,
  normalizeStoredCalibration,
  normalizeStoredCoupleAlignment,
  normalizeStoredGoal,
  normalizeStoredHousehold,
  normalizeStoredPrimaryFocus,
  type GoalId,
  type HouseholdId,
  type LifeEventId,
  type OnboardingData,
  type PrimaryFocusId,
} from '~/lib/onboarding-types';

import { MOCK_TEST_USER, useAuth } from '~/lib/auth';

export type {
  GoalId,
  HouseholdId,
  LifeEventId,
  OnboardingData,
  PrimaryFocusId,
} from '~/lib/onboarding-types';

export const ONBOARDING_STORAGE_KEY = '@atlas-mvp-vibes/onboarding';

const defaultData = defaultOnboardingData;

type OnboardingContextValue = {
  data: OnboardingData;
  hydrated: boolean;
  setGoal: (g: GoalId) => void;
  setLinkedBankIds: (ids: string[]) => void;
  setHousehold: (h: HouseholdId) => void;
  toggleLifeEvent: (id: LifeEventId) => void;
  setPrimaryFocus: (f: PrimaryFocusId | null) => void;
  markComplete: () => Promise<void>;
  reset: () => Promise<void>;
};

const OnboardingContext = React.createContext<OnboardingContextValue | null>(null);

async function readStored(): Promise<OnboardingData> {
  try {
    const raw = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) return { ...defaultData };
    const parsed = JSON.parse(raw) as Partial<OnboardingData> & {
      incomeRange?: unknown;
      saverType?: unknown;
    };
    const goal = normalizeStoredGoal(parsed.goal);
    return {
      ...defaultData,
      goal,
      goalCalibration: normalizeStoredCalibration(parsed.goalCalibration),
      coupleAlignment: normalizeStoredCoupleAlignment(parsed.coupleAlignment),
      linkedBankIds: Array.isArray(parsed.linkedBankIds) ? parsed.linkedBankIds : [],
      completed: Boolean(parsed.completed),
      household: normalizeStoredHousehold(parsed.household),
      lifeEventIds: normalizeLifeEventList(parsed.lifeEventIds),
      primaryFocus: normalizeStoredPrimaryFocus(parsed.primaryFocus),
    };
  } catch {
    return { ...defaultData };
  }
}

async function writeStored(data: OnboardingData) {
  await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(data));
}

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [data, setData] = React.useState<OnboardingData>(defaultData);
  const [hydrated, setHydrated] = React.useState(false);
  const skipNextPersistRef = React.useRef(true);
  const suppressPersistEffectRef = React.useRef(0);

  React.useEffect(() => {
    void readStored().then((d) => {
      setData((prev) => mergeRehydration(prev, d));
      setHydrated(true);
    });
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    if (skipNextPersistRef.current) {
      skipNextPersistRef.current = false;
      return;
    }
    if (suppressPersistEffectRef.current > 0) return;
    void writeStored(data);
  }, [data, hydrated]);

  React.useEffect(() => {
    if (!user?.id) return;
    void readStored().then((d) => {
      setData((prev) => mergeRehydration(prev, d));
    });
  }, [user?.id]);

  React.useEffect(() => {
    if (!user) return;
    if (user.id === MOCK_TEST_USER.id) {
      setData((prev) => {
        if (prev.completed) return prev;
        return { ...prev, completed: true };
      });
    }
  }, [user]);

  const persist = React.useCallback(async (next: OnboardingData) => {
    suppressPersistEffectRef.current += 1;
    setData(next);
    try {
      await writeStored(next);
    } finally {
      suppressPersistEffectRef.current -= 1;
    }
  }, []);

  const setGoal = React.useCallback((g: GoalId) => {
    setData((prev) => ({
      ...prev,
      goal: g,
      goalCalibration: prev.goal === g ? prev.goalCalibration : null,
      coupleAlignment: prev.goal === g ? prev.coupleAlignment : null,
    }));
  }, []);

  const setLinkedBankIds = React.useCallback((ids: string[]) => {
    setData((prev) => ({ ...prev, linkedBankIds: ids }));
  }, []);

  const setHousehold = React.useCallback((h: HouseholdId) => {
    setData((prev) => ({ ...prev, household: h }));
  }, []);

  const toggleLifeEvent = React.useCallback((id: LifeEventId) => {
    setData((prev) => {
      const next = new Set(prev.lifeEventIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { ...prev, lifeEventIds: [...next] };
    });
  }, []);

  const setPrimaryFocus = React.useCallback((f: PrimaryFocusId | null) => {
    setData((prev) => ({ ...prev, primaryFocus: f }));
  }, []);

  const markComplete = React.useCallback(async () => {
    const next = { ...data, completed: true };
    await persist(next);
  }, [data, persist]);

  const reset = React.useCallback(async () => {
    await writeStored(defaultData);
    setData(defaultData);
  }, []);

  const prevUserRef = React.useRef<typeof user | undefined>(undefined);
  React.useEffect(() => {
    if (prevUserRef.current === undefined) {
      prevUserRef.current = user;
      return;
    }
    if (prevUserRef.current !== null && user === null) {
      void reset();
    }
    prevUserRef.current = user;
  }, [user, reset]);

  const value = React.useMemo<OnboardingContextValue>(
    () => ({
      data,
      hydrated,
      setGoal,
      setLinkedBankIds,
      setHousehold,
      toggleLifeEvent,
      setPrimaryFocus,
      markComplete,
      reset,
    }),
    [data, hydrated, setGoal, setLinkedBankIds, setHousehold, toggleLifeEvent, setPrimaryFocus, markComplete, reset]
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding(): OnboardingContextValue {
  const ctx = React.useContext(OnboardingContext);
  if (!ctx) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return ctx;
}
