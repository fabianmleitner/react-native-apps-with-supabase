import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Chip } from '../atoms/Chip';
import { DifficultyBadge } from '../atoms/DifficultyBadge';
import { WorkoutGlyph } from '../atoms/WorkoutGlyph';
import type { Workout } from '../data/workoutData';
import { workoutColors, workoutTypography } from '../tokens';

export interface DesignWorkoutCardProps {
  workout: Workout;
  onPress?: () => void;
}

export function DesignWorkoutCard({ workout, onPress }: DesignWorkoutCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <WorkoutGlyph focus={workout.focus} />
      <View style={styles.body}>
        <Text style={workoutTypography.eyebrow}>{workout.focus}</Text>
        <Text style={styles.title} numberOfLines={1}>
          {workout.title}
        </Text>
        <View style={styles.meta}>
          <Chip label={`${workout.duration} min`} />
          <DifficultyBadge level={workout.level} small />
        </View>
      </View>
      <View style={styles.chevron}>
        <Text style={styles.chevronText}>›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 22,
    backgroundColor: workoutColors.surface,
    borderWidth: 1,
    borderColor: workoutColors.border
  },
  body: {
    flex: 1,
    minWidth: 0,
    gap: 5
  },
  title: {
    color: workoutColors.text,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap'
  },
  chevron: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: workoutColors.bgDeep,
    alignItems: 'center',
    justifyContent: 'center'
  },
  chevronText: {
    color: workoutColors.text,
    fontSize: 24,
    lineHeight: 24
  }
});
