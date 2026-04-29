import { Redirect } from 'expo-router';
import * as React from 'react';

import { canAccessAppShell, useAuth } from '~/lib/auth';
import { useOnboarding } from '~/lib/onboarding';

/** Authenticated entry: plan preview when onboarding is done, otherwise primer. */
export default function Index() {
  const { user, hydrated: ah } = useAuth();
  const { data, hydrated: oh } = useOnboarding();

  // #region agent log
  React.useEffect(() => {
    if (!ah || !oh) {
      fetch('http://127.0.0.1:7296/ingest/8ca10641-5bf3-4fb5-8642-08318e4e7f93', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '816752' },
        body: JSON.stringify({
          sessionId: '816752',
          location: 'app/index.tsx:Index',
          message: 'waiting hydration',
          data: { ah, oh },
          timestamp: Date.now(),
          hypothesisId: 'H3',
          runId: 'post-fix',
        }),
      }).catch(() => {});
      return;
    }
    const dest = !user
      ? '/sign-in'
      : canAccessAppShell(user, data.completed)
        ? '/onboarding/plan-preview'
        : '/onboarding/primer';
    fetch('http://127.0.0.1:7296/ingest/8ca10641-5bf3-4fb5-8642-08318e4e7f93', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '816752' },
      body: JSON.stringify({
        sessionId: '816752',
        location: 'app/index.tsx:Index',
        message: 'redirect',
        data: {
          dest,
          hasUser: Boolean(user),
          onboardingCompleted: data.completed,
        },
        timestamp: Date.now(),
        hypothesisId: 'H3',
        runId: 'post-fix',
      }),
    }).catch(() => {});
  }, [ah, oh, user, data.completed]);
  // #endregion

  if (!ah || !oh) {
    return null;
  }

  if (!user) {
    return <Redirect href="/sign-in" />;
  }

  if (canAccessAppShell(user, data.completed)) {
    return <Redirect href="/onboarding/plan-preview" />;
  }

  return <Redirect href="/onboarding/primer" />;
}
