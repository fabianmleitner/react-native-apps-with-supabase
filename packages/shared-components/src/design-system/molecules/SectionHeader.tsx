import { Pressable, StyleSheet, Text, View } from 'react-native';

import { workoutColors } from '../tokens';

export interface SectionHeaderProps {
  title: string;
  action?: string;
  onPress?: () => void;
}

export function SectionHeader({ title, action, onPress }: SectionHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {action ? (
        <Pressable onPress={onPress}>
          <Text style={styles.action}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 4
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: workoutColors.text,
    letterSpacing: -0.2
  },
  action: {
    fontSize: 13,
    color: workoutColors.accentDeep,
    fontWeight: '700'
  }
});
