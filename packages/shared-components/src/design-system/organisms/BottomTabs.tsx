import { Pressable, StyleSheet, Text, View } from 'react-native';

import { workoutColors } from '../tokens';

export type WorkoutTab = 'dashboard' | 'workouts' | 'progress' | 'health' | 'profile';

export interface BottomTabsProps {
  active: string;
  onNavigate?: (tab: WorkoutTab) => void;
}

const tabs: Array<{ key: WorkoutTab; label: string; icon: string }> = [
  { key: 'dashboard', label: 'Home', icon: '⌂' },
  { key: 'workouts', label: 'Workouts', icon: '▣' },
  { key: 'progress', label: 'Progress', icon: '▥' },
  { key: 'health', label: 'Health', icon: '●' },
  { key: 'profile', label: 'Profile', icon: '◌' }
];

export function BottomTabs({ active, onNavigate }: BottomTabsProps) {
  return (
    <View style={styles.bar}>
      {tabs.map((tab) => {
        const selected =
          active === tab.key ||
          (tab.key === 'dashboard' && (active === 'workoutDetail' || active === 'active'));
        return (
          <Pressable key={tab.key} onPress={() => onNavigate?.(tab.key)} style={styles.item}>
            <Text style={[styles.icon, selected && styles.active]}>{tab.icon}</Text>
            <Text style={[styles.label, selected && styles.active]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 68,
    borderRadius: 28,
    backgroundColor: workoutColors.surface,
    borderWidth: 1,
    borderColor: workoutColors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 3
  },
  icon: {
    color: workoutColors.textSoft,
    fontSize: 18,
    fontWeight: '900'
  },
  label: {
    color: workoutColors.textSoft,
    fontSize: 10.5,
    fontWeight: '800'
  },
  active: {
    color: workoutColors.accentDeep
  }
});
