import React from 'react';
import { View } from 'react-native';

import { DifficultyBadge } from '../../src';

const meta = {
  title: 'Design System/Atoms/DifficultyBadge',
  component: DifficultyBadge,
  parameters: {
    layout: 'centered'
  },
  render: () => (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <DifficultyBadge level="Beginner" />
      <DifficultyBadge level="Intermediate" />
      <DifficultyBadge level="Advanced" />
    </View>
  )
};

export default meta;

export const AllStates = {};
