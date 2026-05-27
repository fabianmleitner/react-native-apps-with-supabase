import { StyleSheet, Text, View } from 'react-native';

import { workoutColors } from '../tokens';

export interface BenefitCardProps {
  icon: string;
  title: string;
  body: string;
}

export function BenefitCard({ icon, title, body }: BenefitCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.icon}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 14,
    padding: 16,
    borderRadius: 22,
    backgroundColor: workoutColors.surface,
    borderWidth: 1,
    borderColor: workoutColors.border
  },
  icon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: workoutColors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconText: {
    color: workoutColors.accentDeep,
    fontWeight: '800',
    fontSize: 18
  },
  copy: {
    flex: 1,
    minWidth: 0
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: workoutColors.text
  },
  body: {
    marginTop: 3,
    fontSize: 13,
    lineHeight: 19,
    color: workoutColors.textMuted
  }
});
