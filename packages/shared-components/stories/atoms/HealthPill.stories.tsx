import React from 'react';
import { View } from 'react-native';

import { HealthPill } from '../../src';

const meta = {
  title: 'Design System/Atoms/HealthPill',
  component: HealthPill,
  parameters: {
    layout: 'centered'
  },
  render: () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, width: 360 }}>
      <HealthPill status="IDLE" />
      <HealthPill status="LOADING" />
      <HealthPill status="HEALTHY" />
      <HealthPill status="UNHEALTHY" />
    </View>
  )
};

export default meta;

export const AllStates = {};
