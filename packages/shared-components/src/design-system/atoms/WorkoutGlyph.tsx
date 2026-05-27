import { StyleSheet, Text, View } from 'react-native';

import { workoutColors } from '../tokens';

export interface WorkoutGlyphProps {
  focus: string;
  large?: boolean;
}

export function WorkoutGlyph({ focus, large }: WorkoutGlyphProps) {
  const tone =
    focus === 'Core'
      ? styles.core
      : focus === 'Athletic'
        ? styles.athletic
        : styles.lower;

  return (
    <View style={[styles.glyph, large && styles.large, tone]}>
      <Text style={styles.text}>II</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  glyph: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  large: {
    width: 56,
    height: 56
  },
  lower: {
    backgroundColor: workoutColors.accent
  },
  core: {
    backgroundColor: '#EEC85C'
  },
  athletic: {
    backgroundColor: '#D7745B'
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -3
  }
});
