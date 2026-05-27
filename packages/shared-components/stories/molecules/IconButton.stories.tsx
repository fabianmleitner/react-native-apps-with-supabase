import React from 'react';
import { View } from 'react-native';

import { IconButton } from '../../src';

const meta = {
  title: 'Design System/Molecules/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered'
  }
};

export default meta;

export const Default = {
  args: {
    label: '+'
  }
};

export const AllIcons = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <IconButton label="+" />
      <IconButton label="×" />
      <IconButton label="→" />
      <IconButton label="↑" />
      <IconButton label="⋯" />
    </View>
  )
};
