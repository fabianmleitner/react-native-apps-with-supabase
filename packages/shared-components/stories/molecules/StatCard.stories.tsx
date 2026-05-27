import React from 'react';
import { View } from 'react-native';

import { StatCard } from '../../src';

const meta = {
  title: 'Design System/Molecules/StatCard',
  component: StatCard,
  parameters: {
    layout: 'centered'
  },
  render: () => (
    <View style={{ width: 360, flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
      <StatCard label="Workouts" value="14" sublabel="this month" />
      <StatCard label="Total minutes" value="486" sublabel="+12% vs last" />
      <StatCard label="Current streak" value="12 d" sublabel="best: 24 d" />
      <StatCard label="Avg difficulty" value="Mod" sublabel="RPE 6.4" />
    </View>
  )
};

export default meta;

export const Grid = {};
