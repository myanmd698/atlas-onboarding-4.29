import { useRouter } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import * as React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandLogo } from '~/components/auth/brand-logo';
import { SplitAuthLayout } from '~/components/auth/split-auth-layout';
import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icon';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Text } from '~/components/ui/text';
import { MOCK_TEST_PASSWORD, MOCK_TEST_USERNAME, useAuth } from '~/lib/auth';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await signIn(username.trim(), password);
      if (res.ok) {
        router.replace('/');
      } else {
        setError(res.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setUsername(MOCK_TEST_USERNAME);
    setPassword(MOCK_TEST_PASSWORD);
    setError(null);
  };

  const formBody = (
    <View className="w-full max-w-md self-center">
      <View className="mb-8 items-center">
        <BrandLogo size={44} />
        <Text variant="headingLarge" className="mt-6 text-center font-serif">
          Sign in
        </Text>
        <Text variant="paragraphSmall" className="mt-2 text-center text-muted-foreground">
          Welcome back, use{' '}
          <Text variant="paragraphSmall" className="font-medium text-foreground">
            test / test
          </Text>{' '}
          to skip setup.
        </Text>
      </View>

      <View className="gap-4">
        <View className="gap-1.5">
          <Label nativeID="username">Username</Label>
          <Input
            nativeID="username"
            placeholder="test"
            autoCapitalize="none"
            autoCorrect={false}
            value={username}
            onChangeText={setUsername}
            accessibilityLabel="Username"
          />
        </View>
        <View className="gap-1.5">
          <Label nativeID="password">Password</Label>
          <View className="relative">
            <Input
              nativeID="password"
              placeholder="••••••••"
              secureTextEntry={!showPw}
              value={password}
              onChangeText={setPassword}
              className="pr-11"
              accessibilityLabel="Password"
            />
            <Pressable
              accessibilityLabel={showPw ? 'Hide password' : 'Show password'}
              hitSlop={8}
              onPress={() => setShowPw((s) => !s)}
              className="absolute bottom-0 right-0 top-0 justify-center px-3">
              <Icon as={showPw ? EyeOff : Eye} size={18} className="text-muted-foreground" />
            </Pressable>
          </View>
        </View>

        {error ? (
          <Text variant="paragraphSmall" className="font-medium text-destructive">
            {error}
          </Text>
        ) : null}

        <Button onPress={() => void onSubmit()} disabled={loading} className="w-full">
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text variant="labelMedium" className="text-primary-foreground">
              Sign in
            </Text>
          )}
        </Button>

        <Pressable
          accessibilityRole="link"
          accessibilityLabel="Fill demo credentials"
          onPress={fillDemo}
          className="self-center py-1 active:opacity-70 web:cursor-pointer">
          <Text variant="paragraphSmall" className="font-medium text-foreground underline underline-offset-2">
            Fill demo credentials
          </Text>
        </Pressable>

        <View className="flex-row flex-wrap justify-center gap-1 pt-2">
          <Text variant="paragraphSmall" className="text-muted-foreground">
            New here?
          </Text>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel="Create an account"
            onPress={() => router.push('/sign-up')}
            className="active:opacity-70 web:cursor-pointer">
            <Text variant="paragraphSmall" className="font-medium text-foreground underline underline-offset-2">
              Create an account
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  const form = (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="w-full">
      {formBody}
    </KeyboardAvoidingView>
  );

  if (Platform.OS !== 'web') {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}>
          <ScrollView
            className="flex-1 px-5"
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 24,
              paddingBottom: 32,
            }}>
            {formBody}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return <SplitAuthLayout variant="monochrome">{form}</SplitAuthLayout>;
}
