import { StyleSheet, Text, View } from 'react-native';

import type { HealthStatus } from '../data/workoutData';
import { workoutColors } from '../tokens';

export interface HealthPillProps {
  status: HealthStatus;
}

export function HealthPill({ status }: HealthPillProps) {
  const tone =
    status === 'HEALTHY'
      ? styles.healthy
      : status === 'UNHEALTHY'
        ? styles.unhealthy
        : status === 'LOADING'
          ? styles.loading
          : styles.idle;

  return (
    <View style={[styles.pill, tone]}>
      <HealthDot status={status} />
      <Text style={styles.text}>{status}</Text>
    </View>
  );
}

export function HealthDot({ status }: HealthPillProps) {
  const tone =
    status === 'HEALTHY'
      ? styles.dotHealthy
      : status === 'UNHEALTHY'
        ? styles.dotUnhealthy
        : status === 'LOADING'
          ? styles.dotLoading
          : styles.dotIdle;

  return <View style={[styles.dot, tone]} />;
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 999
  },
  idle: {
    backgroundColor: workoutColors.idleBg
  },
  loading: {
    backgroundColor: workoutColors.intermediateBg
  },
  healthy: {
    backgroundColor: workoutColors.beginnerBg
  },
  unhealthy: {
    backgroundColor: workoutColors.advancedBg
  },
  text: {
    fontSize: 11,
    fontWeight: '900',
    color: workoutColors.text
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 999
  },
  dotIdle: {
    backgroundColor: workoutColors.idleFg
  },
  dotLoading: {
    backgroundColor: workoutColors.intermediateFg
  },
  dotHealthy: {
    backgroundColor: workoutColors.beginnerFg
  },
  dotUnhealthy: {
    backgroundColor: workoutColors.advancedFg
  }
});
