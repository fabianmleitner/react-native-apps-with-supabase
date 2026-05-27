import { StyleSheet, Text, View } from 'react-native';

import { workoutColors } from '../tokens';

export function Chip({ label }: { label: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: workoutColors.surface,
    borderWidth: 1,
    borderColor: workoutColors.border
  },
  text: {
    color: workoutColors.textMuted,
    fontSize: 12,
    fontWeight: '700'
  }
});
