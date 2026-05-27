import React from 'react';
import { View } from 'react-native';

import { Chip } from '../../src';

const meta = {
  title: 'Design System/Atoms/Chip',
  component: Chip,
  parameters: {
    layout: 'centered'
  }
};

export default meta;

export const AllStates = {
  render: () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, width: 360 }}>
      <Chip label="Strength" />
      <Chip label="Cardio" />
      <Chip label="Mobility" />
      <Chip label="HIIT" />
      <Chip label="Recovery" />
    </View>
  )
};

export const Single = {
  args: {
    label: 'Strength'
  }
};
