import { StyleSheet, Text, View } from 'react-native';

import { WorkoutButton } from '../atoms/Button';
import { BenefitCard } from '../molecules/BenefitCard';
import { workoutColors } from '../tokens';

export function OnboardingScreen() {
  return (
    <View style={styles.screen}>
      <View>
        <Text style={styles.title}>Train with{'\n'}intention.</Text>
        <Text style={styles.body}>
          Workout App helps you plan sessions, log results, and watch your weekly effort add up.
        </Text>
      </View>
      <View style={styles.stack}>
        <BenefitCard icon="◎" title="Personalized plans" body="Workouts tuned to your goals and schedule." />
        <BenefitCard icon="◷" title="Track every session" body="Duration, difficulty, and effort in one place." />
        <BenefitCard icon="△" title="Stay consistent" body="Weekly progress and streaks that keep training visible." />
      </View>
      <View style={styles.actions}>
        <WorkoutButton label="Get Started" />
        <WorkoutButton label="I already have an account" variant="ghost" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    width: 390,
    minHeight: 760,
    padding: 24,
    paddingTop: 72,
    gap: 28,
    backgroundColor: workoutColors.bg
  },
  title: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '700',
    color: workoutColors.text,
    letterSpacing: -1
  },
  body: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 23,
    color: workoutColors.textMuted,
    maxWidth: 310
  },
  stack: {
    gap: 12
  },
  actions: {
    marginTop: 'auto',
    gap: 10
  }
});
