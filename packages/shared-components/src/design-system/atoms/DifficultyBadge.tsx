import { StyleSheet, Text, View } from 'react-native';

import type { WorkoutLevel } from '../data/workoutData';
import { workoutColors } from '../tokens';

export interface DifficultyBadgeProps {
  level: WorkoutLevel;
  small?: boolean;
}

export function DifficultyBadge({ level, small }: DifficultyBadgeProps) {
  const tone =
    level === 'Beginner'
      ? styles.beginner
      : level === 'Intermediate'
        ? styles.intermediate
        : styles.advanced;
  const dot =
    level === 'Beginner'
      ? styles.dotBeginner
      : level === 'Intermediate'
        ? styles.dotIntermediate
        : styles.dotAdvanced;
  const text =
    level === 'Beginner'
      ? styles.textBeginner
      : level === 'Intermediate'
        ? styles.textIntermediate
        : styles.textAdvanced;

  return (
    <View style={[styles.badge, small && styles.small, tone]}>
      <View style={[styles.dot, dot]} />
      <Text style={[styles.text, text]}>{level}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999
  },
  small: {
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  beginner: {
    backgroundColor: workoutColors.beginnerBg
  },
  intermediate: {
    backgroundColor: workoutColors.intermediateBg
  },
  advanced: {
    backgroundColor: workoutColors.advancedBg
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 999
  },
  dotBeginner: {
    backgroundColor: workoutColors.beginnerFg
  },
  dotIntermediate: {
    backgroundColor: workoutColors.intermediateFg
  },
  dotAdvanced: {
    backgroundColor: workoutColors.advancedFg
  },
  text: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  textBeginner: {
    color: workoutColors.beginnerFg
  },
  textIntermediate: {
    color: workoutColors.intermediateFg
  },
  textAdvanced: {
    color: workoutColors.advancedFg
  }
});
