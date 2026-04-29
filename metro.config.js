const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

const config = getDefaultConfig(__dirname);

// Keep Storybook in the Metro graph so you can switch app ↔ Storybook in dev without restarting.
const storybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK !== '0';

// NativeWind outermost so CSS processing still applies when Storybook wraps Metro.
module.exports = withNativeWind(
  withStorybook(config, {
    enabled: storybookEnabled,
    configPath: path.resolve(__dirname, './.rnstorybook'),
  }),
  { input: './global.css', inlineRem: 16 }
);
