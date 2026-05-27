import { Pressable, StyleSheet, Text } from 'react-native';

import { workoutColors } from '../tokens';

export interface WorkoutButtonProps {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
}

export function WorkoutButton({ label, onPress, variant = 'primary', disabled }: WorkoutButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={[
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        variant === 'ghost' && styles.ghost,
        disabled && styles.disabled
      ]}
    >
      <Text style={[styles.text, isPrimary ? styles.primaryText : styles.secondaryText, disabled && styles.disabledText]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  primary: {
    backgroundColor: workoutColors.accent
  },
  secondary: {
    backgroundColor: workoutColors.surface,
    borderWidth: 1,
    borderColor: workoutColors.borderStrong
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 0
  },
  disabled: {
    backgroundColor: 'rgba(20,24,28,0.12)',
    borderWidth: 0
  },
  text: {
    fontSize: 16,
    fontWeight: '800'
  },
  primaryText: {
    color: workoutColors.accentInk
  },
  secondaryText: {
    color: workoutColors.text
  },
  disabledText: {
    color: workoutColors.textSoft
  }
});
