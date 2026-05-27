import { Pressable, StyleSheet, Text } from 'react-native';

import { workoutColors } from '../tokens';

export interface IconButtonProps {
  label: string;
  onPress?: () => void;
}

export function IconButton({ label, onPress }: IconButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: workoutColors.surface,
    borderWidth: 1,
    borderColor: workoutColors.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: workoutColors.text,
    fontSize: 15,
    fontWeight: '800'
  }
});
