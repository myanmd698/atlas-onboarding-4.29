import { View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Text as UIText } from '~/components/ui/text';

export type HeaderProps = {
  user?: { name: string };
  onLogin: () => void;
  onLogout: () => void;
  onCreateAccount: () => void;
};

export const Header = ({ user, onLogin, onLogout, onCreateAccount }: HeaderProps) => (
  <View>
    <View className="border-border flex-row justify-between border-b px-5 py-4">
      <View className="flex-row items-center">
        <UIText variant="headingXSmall" className="ml-2.5 text-foreground">
          Acme
        </UIText>
      </View>
      <View className="flex-row items-center">
        {user ? (
          <>
            <UIText variant="paragraphSmall" className="text-muted-foreground">
              Welcome,{' '}
            </UIText>
            <UIText variant="labelMedium" className="text-foreground">
              {user.name}
            </UIText>
            <UIText variant="paragraphSmall" className="text-muted-foreground">
              !
            </UIText>

            <Button className="ml-2.5" size="sm" variant="secondary" onPress={onLogout}>
              <UIText>Log out</UIText>
            </Button>
          </>
        ) : (
          <>
            <Button className="ml-2.5" size="sm" variant="outline" onPress={onLogin}>
              <UIText>Log in</UIText>
            </Button>

            <Button className="ml-2.5" size="sm" variant="default" onPress={onCreateAccount}>
              <UIText>Sign up</UIText>
            </Button>
          </>
        )}
      </View>
    </View>
  </View>
);
