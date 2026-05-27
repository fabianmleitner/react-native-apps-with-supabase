import { StyleSheet, Text, View } from 'react-native';

import { workoutColors, workoutTypography } from '../tokens';

export function HeroProgress() {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View>
          <Text style={workoutTypography.eyebrow}>This week</Text>
          <Text style={styles.value}>
            3<Text style={styles.valueMuted}>/5</Text>
          </Text>
          <Text style={workoutTypography.subtitle}>sessions complete</Text>
        </View>
        <View style={styles.ring}>
          <Text style={styles.ringText}>60%</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.stats}>
        <HeroStat label="Streak" value="12" unit="days" />
        <HeroStat label="Volume" value="184" unit="min" />
        <HeroStat label="Effort" value="Mod" />
      </View>
    </View>
  );
}

function HeroStat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>
        {value}
        {unit ? <Text style={styles.statUnit}> {unit}</Text> : null}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 18,
    borderRadius: 28,
    backgroundColor: workoutColors.surface,
    borderWidth: 1,
    borderColor: workoutColors.border
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  value: {
    marginTop: 4,
    fontSize: 30,
    fontWeight: '800',
    color: workoutColors.text,
    letterSpacing: -1
  },
  valueMuted: {
    color: workoutColors.textSoft,
    fontWeight: '600'
  },
  ring: {
    width: 72,
    height: 72,
    borderRadius: 999,
    borderWidth: 8,
    borderColor: workoutColors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: workoutColors.accentSoft
  },
  ringText: {
    color: workoutColors.text,
    fontWeight: '800',
    fontSize: 14
  },
  divider: {
    height: 1,
    backgroundColor: workoutColors.border,
    marginVertical: 14
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  statLabel: {
    color: workoutColors.textSoft,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  statValue: {
    marginTop: 4,
    color: workoutColors.text,
    fontSize: 20,
    fontWeight: '800'
  },
  statUnit: {
    fontSize: 11,
    color: workoutColors.textMuted,
    fontWeight: '600'
  }
});
