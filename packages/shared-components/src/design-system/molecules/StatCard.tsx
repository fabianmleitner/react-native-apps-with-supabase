import { StyleSheet, Text, View } from 'react-native';

import { workoutColors, workoutTypography } from '../tokens';

export interface StatCardProps {
  label: string;
  value: string;
  sublabel?: string;
}

export function StatCard({ label, value, sublabel }: StatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={workoutTypography.eyebrow}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {sublabel ? <Text style={styles.sublabel}>{sublabel}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '47%',
    minHeight: 102,
    padding: 14,
    borderRadius: 22,
    backgroundColor: workoutColors.surface,
    borderWidth: 1,
    borderColor: workoutColors.border,
    gap: 8
  },
  value: {
    color: workoutColors.text,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.8
  },
  sublabel: {
    fontSize: 12,
    color: workoutColors.textSoft,
    fontWeight: '600'
  }
});
