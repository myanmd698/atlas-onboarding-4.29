import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const native = Platform.OS === 'ios' || Platform.OS === 'android';

function safe(run: () => Promise<void>) {
  if (!native) return;
  void run().catch(() => {});
}

/** Selection / navigation (tabs, sidebar, list rows) — medium impact. */
export function hapticsSelection() {
  safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
}

/** Standard taps — buttons, switches, checkboxes, toggles — medium impact. */
export function hapticsImpactLight() {
  safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
}

/** Strong — destructive buttons and other high-emphasis actions — heavy impact. */
export function hapticsImpactMedium() {
  safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy));
}

/** App nav drawer opened. */
export function hapticsDrawerOpen() {
  safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
}

/** App nav drawer closed. */
export function hapticsDrawerClose() {
  safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
}
