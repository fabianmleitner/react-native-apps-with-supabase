import React from 'react';
import { View } from 'react-native';

import { WorkoutButton } from '../../src';

const meta = {
  title: 'Design System/Atoms/Button',
  component: WorkoutButton,
  parameters: {
    layout: 'centered'
  },
  decorators: [
    (Story: React.ComponentType) => (
      <View style={{ width: 320, gap: 10 }}>
        <Story />
      </View>
    )
  ]
};

export default meta;

export const Primary = {
  args: {
    label: 'Get Started',
    variant: 'primary'
  }
};

export const Secondary = {
  args: {
    label: 'Save for later',
    variant: 'secondary'
  }
};

export const Ghost = {
  args: {
    label: 'I already have an account',
    variant: 'ghost'
  }
};

export const Disabled = {
  args: {
    label: 'Create Account',
    disabled: true
  }
};
