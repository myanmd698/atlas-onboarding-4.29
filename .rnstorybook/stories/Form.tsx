import { View } from 'react-native';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Checkbox } from '~/components/ui/checkbox';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Separator } from '~/components/ui/separator';
import { Switch } from '~/components/ui/switch';
import { Text } from '~/components/ui/text';
import { Textarea } from '~/components/ui/textarea';

export type FormProps = {
  /** Called when the user taps Submit (Storybook / demo). */
  onSubmit?: () => void;
};

const ids = {
  name: 'form-name',
  email: 'form-email',
  notes: 'form-notes',
  contact: 'form-contact',
  terms: 'form-terms',
  marketing: 'form-marketing',
} as const;

/**
 * Example screen composing reusable form primitives (Card, Label, Input, Select, etc.).
 */
export function Form({ onSubmit }: FormProps) {
  return (
    <Card className="w-full max-w-xl self-stretch">
      <CardHeader>
        <CardTitle variant="headingMedium">Contact</CardTitle>
        <CardDescription>Example form built from components/ui primitives.</CardDescription>
      </CardHeader>
      <CardContent className="gap-6">
        <View className="gap-2">
          <Label nativeID={ids.name}>
            <Text>Name</Text>
          </Label>
          <Input nativeID={ids.name} placeholder="Ada Lovelace" />
        </View>

        <View className="gap-2">
          <Label nativeID={ids.email}>
            <Text>Email</Text>
          </Label>
          <Input nativeID={ids.email} placeholder="you@company.com" keyboardType="email-address" />
        </View>

        <View className="gap-2">
          <Label nativeID={ids.notes}>
            <Text>Notes</Text>
          </Label>
          <Textarea nativeID={ids.notes} placeholder="Anything we should know?" numberOfLines={4} />
        </View>

        <Separator />

        <View className="gap-2">
          <Text className="text-muted-foreground text-sm">Department</Text>
          <Select defaultValue={{ value: 'eng', label: 'Engineering' }}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eng" label="Engineering" />
              <SelectItem value="design" label="Design" />
              <SelectItem value="support" label="Support" />
            </SelectContent>
          </Select>
        </View>

        <View className="gap-3">
          <Text className="text-muted-foreground text-sm">Preferred contact</Text>
          <RadioGroup defaultValue="email">
            <View className="flex-row items-center gap-2">
              <RadioGroupItem value="email" id={`${ids.contact}-email`} />
              <Label htmlFor={`${ids.contact}-email`}>
                <Text>Email</Text>
              </Label>
            </View>
            <View className="flex-row items-center gap-2">
              <RadioGroupItem value="phone" id={`${ids.contact}-phone`} />
              <Label htmlFor={`${ids.contact}-phone`}>
                <Text>Phone</Text>
              </Label>
            </View>
          </RadioGroup>
        </View>

        <Separator />

        <View className="flex-row items-center gap-2">
          <Checkbox id={ids.terms} defaultChecked />
          <Label htmlFor={ids.terms}>
            <Text>I agree to the terms</Text>
          </Label>
        </View>

        <View className="flex-row items-center justify-between gap-4">
          <Label className="flex-1" htmlFor={ids.marketing}>
            <Text>Product updates</Text>
          </Label>
          <Switch id={ids.marketing} defaultChecked />
        </View>
      </CardContent>
      <CardFooter className="flex-row flex-wrap justify-end gap-2">
        <Button variant="outline" onPress={() => {}}>
          <Text>Cancel</Text>
        </Button>
        <Button onPress={onSubmit}>
          <Text>Submit</Text>
        </Button>
      </CardFooter>
    </Card>
  );
}
