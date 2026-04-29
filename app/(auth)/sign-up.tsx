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
import {
  evaluatePassword,
  isPasswordValid,
  PasswordCriteria,
} from '~/components/auth/password-criteria';
import { SplitAuthLayout } from '~/components/auth/split-auth-layout';
import { Button } from '~/components/ui/button';
import { Icon } from '~/components/ui/icon';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Text } from '~/components/ui/text';
import {
  DEMO_SIGNUP_EMAIL,
  DEMO_SIGNUP_FULL_NAME,
  DEMO_SIGNUP_PASSWORD,
  useAuth,
} from '~/lib/auth';

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [email, setEmail] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const checks = React.useMemo(() => evaluatePassword(password), [password]);
  const passwordOk = isPasswordValid(checks);
  const canNext = email.trim().length > 0 && fullName.trim().length > 0 && passwordOk;

  const onNext = async () => {
    if (!canNext) return;
    setLoading(true);
    try {
      await signUp(email.trim(), fullName.trim(), password);
      router.replace('/onboarding/primer');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail(DEMO_SIGNUP_EMAIL);
    setFullName(DEMO_SIGNUP_FULL_NAME);
    setPassword(DEMO_SIGNUP_PASSWORD);
  };

  const formBody = (
    <View className="w-full max-w-md self-center">
      <View className="mb-6 items-center">
        <BrandLogo size={44} />
        <Text variant="headingLarge" className="mt-6 text-center font-serif">
          Create an account
        </Text>
      </View>

      <View className="gap-4">
        <View className="gap-1.5">
          <Label nativeID="email">Email</Label>
          <Input
            nativeID="email"
            placeholder="you@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View className="gap-1.5">
          <Label nativeID="fullName">Full name</Label>
          <Input
            nativeID="fullName"
            placeholder="Full name"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>
        <View className="gap-1.5">
          <Label nativeID="password">Create a password</Label>
          <View className="relative">
            <Input
              nativeID="password"
              placeholder="Create a password"
              secureTextEntry={!showPw}
              value={password}
              onChangeText={setPassword}
              className="pr-11"
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

        <PasswordCriteria checks={checks} monochrome />

        <Pressable
          accessibilityRole="link"
          accessibilityLabel="Fill demo credentials"
          onPress={fillDemo}
          className="self-center py-1 active:opacity-70 web:cursor-pointer">
          <Text variant="paragraphSmall" className="font-medium text-foreground underline underline-offset-2">
            Fill demo credentials
          </Text>
        </Pressable>

        <View className="mt-2 flex-row gap-3">
          <Button variant="outline" className="flex-1" onPress={() => router.push('/sign-in')}>
            <Text>Back</Text>
          </Button>
          <Button className="flex-1" disabled={!canNext || loading} onPress={() => void onNext()}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text variant="labelMedium" className="text-primary-foreground">
                Next
              </Text>
            )}
          </Button>
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
