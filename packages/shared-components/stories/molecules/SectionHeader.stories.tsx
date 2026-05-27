import React from 'react';
import { View } from 'react-native';

import { SectionHeader } from '../../src';

const meta = {
  title: 'Design System/Molecules/SectionHeader',
  component: SectionHeader,
  parameters: {
    layout: 'centered'
  },
  decorators: [
    (Story: React.ComponentType) => (
      <View style={{ width: 360 }}>
        <Story />
      </View>
    )
  ],
  args: {
    title: 'Recent Workouts'
  }
};

export default meta;

export const TitleOnly = {
  args: {
    title: 'Recent Workouts'
  }
};

export const WithAction = {
  args: {
    title: 'Recent Workouts',
    action: 'See all'
  }
};

export const GoalsHeader = {
  args: {
    title: 'Your Goals',
    action: 'Edit'
  }
};
