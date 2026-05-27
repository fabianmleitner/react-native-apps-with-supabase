import React from 'react';
import { View } from 'react-native';

import { WorkoutGlyph } from '../../src';

const meta = {
  title: 'Design System/Atoms/WorkoutGlyph',
  component: WorkoutGlyph,
  parameters: {
    layout: 'centered'
  },
  render: () => (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <WorkoutGlyph focus="Lower Body" />
      <WorkoutGlyph focus="Core" />
      <WorkoutGlyph focus="Athletic" />
    </View>
  )
};

export default meta;

export const FocusStates = {};
