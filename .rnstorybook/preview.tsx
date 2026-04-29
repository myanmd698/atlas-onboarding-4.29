import '../global.css';

import type { Decorator, Preview } from '@storybook/react-native';
import * as React from 'react';

import { StorybookThemeFrame } from './StorybookThemeFrame';

const preview: Preview = {
  decorators: [
    (Story) => (
      <StorybookThemeFrame>
        <Story />
      </StorybookThemeFrame>
    ) as Decorator,
  ],
  parameters: {
    options: {
      storySort: {
        order: ['Foundations', 'Patterns', 'Components'],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    /**
     * @storybook/addon-ondevice-controls only shows fields when `argTypes` is non-empty
     * and `parameters.__isArgsStory` is true (requires `render` to accept args).
     * Generated stories use `render: (_args) => …`; this global arg satisfies `hasControls`
     * for files that do not define their own argTypes.
     */
    argTypes: {
      storybookControls: {
        control: 'boolean',
        description: 'Reserved so the Controls tab is enabled (safe to ignore).',
      },
    },
    args: {
      storybookControls: false,
    },
  },
};

export default preview;
