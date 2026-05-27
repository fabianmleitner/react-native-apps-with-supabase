import { StyleSheet, Text, View } from 'react-native';

import { DesignWorkoutCard } from '../molecules/WorkoutCard';
import { SectionHeader } from '../molecules/SectionHeader';
import { HeroProgress } from '../organisms/HeroProgress';
import { workoutFixtures } from '../data/workoutData';
import { workoutColors, workoutTypography } from '../tokens';

export interface DashboardScreenProps {
  onOpenWorkout?: (id: string) => void;
}

export function DashboardScreen({ onOpenWorkout }: DashboardScreenProps) {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.copy}>
          <Text style={workoutTypography.title}>Good morning, Fabian</Text>
          <Text style={workoutTypography.subtitle}>Ready for your next session?</Text>
        </View>
      </View>
      <HeroProgress />
      <SectionHeader title="Upcoming Workouts" action="See all" />
      <View style={styles.stack}>
        {workoutFixtures.map((workout) => (
          <DesignWorkoutCard key={workout.id} workout={workout} onPress={() => onOpenWorkout?.(workout.id)} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    gap: 18,
    padding: 20,
    backgroundColor: workoutColors.bg,
    width: 390
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 14
  },
  copy: {
    flex: 1,
    minWidth: 0
  },
  stack: {
    gap: 10
  }
});
