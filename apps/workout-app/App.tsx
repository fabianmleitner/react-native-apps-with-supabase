import { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import {
  BenefitCard as DSBenefitCard,
  BottomTabs as DSBottomTabs,
  Chip as DSChip,
  DesignWorkoutCard,
  DifficultyBadge as DSDifficultyBadge,
  HealthDot as DSHealthDot,
  HealthPill as DSHealthPill,
  HeroProgress as DSHeroProgress,
  IconButton as DSIconButton,
  SectionHeader as DSSectionHeader,
  StatCard as DSStatCard,
  WorkoutButton,
  WorkoutGlyph as DSWorkoutGlyph
} from '@workout/shared-components';

type Screen =
  | 'splash'
  | 'onboarding'
  | 'register'
  | 'dashboard'
  | 'workouts'
  | 'workoutDetail'
  | 'progress'
  | 'health'
  | 'profile'
  | 'active';

type WorkoutLevel = 'Beginner' | 'Intermediate' | 'Advanced';
type HealthStatus = 'IDLE' | 'LOADING' | 'HEALTHY' | 'UNHEALTHY';

interface Workout {
  id: string;
  title: string;
  duration: number;
  level: WorkoutLevel;
  focus: string;
  kcal: number;
  summary: string;
  equipment: string[];
  notes: string;
  exercises: Array<{ name: string; sets: string; rest: string; tag: string }>;
}

const workouts: Workout[] = [
  {
    id: 'lbs',
    title: 'Lower Body Strength',
    duration: 45,
    level: 'Intermediate',
    focus: 'Lower Body',
    kcal: 380,
    summary:
      'Build strength and stability through compound lower-body movements with focused tempo work.',
    equipment: ['Barbell', 'Dumbbells', 'Bench'],
    notes:
      'Warm up with hip mobility. Aim for RPE 7 across working sets and rest the full 90 seconds.',
    exercises: [
      { name: 'Back Squat', sets: '4 x 6', rest: '90s', tag: 'Compound' },
      { name: 'Romanian Deadlift', sets: '3 x 8', rest: '90s', tag: 'Posterior' },
      { name: 'Walking Lunge', sets: '3 x 12', rest: '60s', tag: 'Unilateral' },
      { name: 'Hip Thrust', sets: '3 x 10', rest: '60s', tag: 'Glutes' },
      { name: 'Calf Raise', sets: '3 x 15', rest: '45s', tag: 'Accessory' }
    ]
  },
  {
    id: 'csc',
    title: 'Core Stability Circuit',
    duration: 20,
    level: 'Beginner',
    focus: 'Core',
    kcal: 160,
    summary:
      'Anti-rotation, anti-extension, and bracing patterns designed to improve trunk control.',
    equipment: ['Mat', 'Resistance Band'],
    notes: 'Move slowly. Quality of bracing beats reps.',
    exercises: [
      { name: 'Dead Bug', sets: '3 x 10', rest: '30s', tag: 'Anti-extension' },
      { name: 'Pallof Press', sets: '3 x 12', rest: '30s', tag: 'Anti-rotation' },
      { name: 'Side Plank', sets: '3 x 30s', rest: '30s', tag: 'Lateral' },
      { name: 'Bird Dog', sets: '3 x 10', rest: '30s', tag: 'Pattern' }
    ]
  },
  {
    id: 'ac',
    title: 'Athlete Conditioning',
    duration: 60,
    level: 'Advanced',
    focus: 'Athletic',
    kcal: 620,
    summary:
      'High-output sprint and plyometric protocol for athletes returning to in-season load.',
    equipment: ['Sled', 'Box', 'Track'],
    notes: 'Skip this if you have not trained conditioning recently. Cooldown is required.',
    exercises: [
      { name: 'Box Jump', sets: '5 x 4', rest: '120s', tag: 'Power' },
      { name: 'Sprint 40m', sets: '6 x 1', rest: '90s', tag: 'Speed' },
      { name: 'Sled Push', sets: '4 x 20m', rest: '120s', tag: 'Resisted' },
      { name: 'Med Ball Slam', sets: '4 x 8', rest: '60s', tag: 'Power' },
      { name: 'Tempo Row', sets: '3 x 500m', rest: '90s', tag: 'Capacity' }
    ]
  }
];

const recentSessions = [
  { date: 'Yesterday', title: 'Upper Body Push', duration: 42, level: 'Intermediate' as const },
  { date: '3 days ago', title: 'Mobility Reset', duration: 18, level: 'Beginner' as const },
  { date: 'Apr 26', title: 'Tempo Run', duration: 35, level: 'Intermediate' as const },
  { date: 'Apr 24', title: 'Athlete Conditioning', duration: 58, level: 'Advanced' as const }
];

const goals = ['Build strength', 'Endurance', 'Lose weight', 'Move better', 'Sport-specific'];

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(workouts[0].id);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    goal: goals[0]
  });
  const [healthStatus, setHealthStatus] = useState<HealthStatus>('IDLE');
  const [healthMessage, setHealthMessage] = useState('No check has run yet.');
  const [lastChecked, setLastChecked] = useState('');
  const [latency, setLatency] = useState<number | null>(null);

  const endpoint = useMemo(() => {
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    return supabaseUrl ? `${supabaseUrl}/auth/v1/settings` : 'Not configured';
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setScreen('onboarding'), 1200);
    return () => clearTimeout(timer);
  }, []);

  const selectedWorkout = workouts.find((workout) => workout.id === selectedWorkoutId) ?? workouts[0];

  function openWorkout(workoutId: string) {
    setSelectedWorkoutId(workoutId);
    setScreen('workoutDetail');
  }

  function toggleSaved(workoutId: string) {
    setSavedIds((current) =>
      current.includes(workoutId) ? current.filter((id) => id !== workoutId) : [...current, workoutId]
    );
  }

  async function runHealthCheck() {
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl) {
      setHealthStatus('UNHEALTHY');
      setHealthMessage('EXPO_PUBLIC_SUPABASE_URL is missing.');
      setLatency(null);
      setLastChecked(new Date().toLocaleTimeString());
      return;
    }

    const startedAt = Date.now();
    setHealthStatus('LOADING');
    setHealthMessage('Checking Supabase connectivity...');

    try {
      const response = await fetch(`${supabaseUrl}/auth/v1/settings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(supabaseAnonKey
            ? {
                apikey: supabaseAnonKey,
                Authorization: `Bearer ${supabaseAnonKey}`
              }
            : {})
        }
      });

      const elapsed = Date.now() - startedAt;
      setLatency(elapsed);
      setLastChecked(new Date().toLocaleTimeString());

      if (!response.ok) {
        setHealthStatus('UNHEALTHY');
        setHealthMessage(`Health check failed. HTTP ${response.status}`);
        return;
      }

      setHealthStatus('HEALTHY');
      setHealthMessage('Supabase API is reachable.');
    } catch {
      setHealthStatus('UNHEALTHY');
      setHealthMessage('Connection could not be established.');
      setLatency(null);
      setLastChecked(new Date().toLocaleTimeString());
    }
  }

  if (screen === 'splash') {
    return <SplashScreen onContinue={() => setScreen('onboarding')} />;
  }

  if (screen === 'onboarding') {
    return <OnboardingScreen onRegister={() => setScreen('register')} onSkip={() => setScreen('dashboard')} />;
  }

  if (screen === 'register') {
    return (
      <RegisterScreen
        form={registerForm}
        success={registerSuccess}
        onBack={() => setScreen('onboarding')}
        onChange={setRegisterForm}
        onSubmit={() => setRegisterSuccess(true)}
        onDashboard={() => {
          setRegisterSuccess(false);
          setScreen('dashboard');
        }}
      />
    );
  }

  const content =
    screen === 'dashboard' ? (
      <DashboardScreen onOpenWorkout={openWorkout} onNavigate={setScreen} />
    ) : screen === 'workouts' ? (
      <WorkoutsScreen onOpenWorkout={openWorkout} />
    ) : screen === 'workoutDetail' ? (
      <WorkoutDetailScreen
        workout={selectedWorkout}
        isSaved={savedIds.includes(selectedWorkout.id)}
        onBack={() => setScreen('dashboard')}
        onSave={() => toggleSaved(selectedWorkout.id)}
        onStart={() => setScreen('active')}
      />
    ) : screen === 'progress' ? (
      <ProgressScreen />
    ) : screen === 'health' ? (
      <HealthScreen
        endpoint={endpoint}
        status={healthStatus}
        message={healthMessage}
        lastChecked={lastChecked}
        latency={latency}
        onRun={runHealthCheck}
      />
    ) : screen === 'profile' ? (
      <ProfileScreen savedCount={savedIds.length} />
    ) : (
      <ActiveWorkoutScreen workout={selectedWorkout} onDone={() => setScreen('dashboard')} />
    );

  return (
    <SafeAreaView style={styles.appShell}>
      <View style={styles.phoneRoot}>
        {content}
        <BottomTabs active={screen} onNavigate={setScreen} />
      </View>
    </SafeAreaView>
  );
}

function SplashScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <SafeAreaView style={styles.splash}>
      <Pressable onPress={onContinue} style={styles.splashPressable}>
        <View style={styles.logoTile}>
          <View style={styles.pulseLine}>
            <View style={styles.pulseShort} />
            <View style={styles.pulseTall} />
            <View style={styles.pulseMid} />
          </View>
        </View>
        <Text style={styles.splashTitle}>Workout App</Text>
        <Text style={styles.splashTagline}>Plan. Train. Progress.</Text>
        <View style={styles.splashFooter}>
          <View style={styles.loadingRing} />
          <Text style={styles.monoMuted}>v1.0.0 · WARMING UP</Text>
        </View>
      </Pressable>
    </SafeAreaView>
  );
}

function OnboardingScreen({
  onRegister,
  onSkip
}: {
  onRegister: () => void;
  onSkip: () => void;
}) {
  return (
    <SafeAreaView style={styles.appShell}>
      <ScrollView contentContainerStyle={styles.onboardingContent}>
        <View style={styles.topRow}>
          <MiniLogo />
          <Pressable onPress={onSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>
        <View>
          <Text style={styles.heroTitle}>Train with{'\n'}intention.</Text>
          <Text style={styles.heroBody}>
            Workout App helps you plan sessions, log results, and watch your weekly effort add up.
          </Text>
        </View>
        <View style={styles.benefitList}>
          <BenefitCard icon="◎" title="Personalized plans" body="Workouts tuned to your goals and schedule." />
          <BenefitCard icon="◷" title="Track every session" body="Duration, difficulty, and effort in one place." />
          <BenefitCard icon="△" title="Stay consistent" body="Weekly progress and streaks that keep training visible." />
        </View>
        <View style={styles.buttonStack}>
          <PrimaryButton label="Get Started" onPress={onRegister} />
          <SecondaryButton label="I already have an account" onPress={onSkip} ghost />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function RegisterScreen({
  form,
  success,
  onBack,
  onChange,
  onSubmit,
  onDashboard
}: {
  form: { name: string; email: string; password: string; goal: string };
  success: boolean;
  onBack: () => void;
  onChange: (form: { name: string; email: string; password: string; goal: string }) => void;
  onSubmit: () => void;
  onDashboard: () => void;
}) {
  const canSubmit = form.name && form.email && form.password;

  if (success) {
    return (
      <SafeAreaView style={styles.appShell}>
        <View style={styles.successScreen}>
          <View style={styles.successMark}>
            <Text style={styles.successCheck}>✓</Text>
          </View>
          <Text style={styles.successTitle}>You're ready to train</Text>
          <Text style={styles.successBody}>
            Welcome aboard, {form.name.split(' ')[0] || 'Fabian'}. Your first week is ready.
          </Text>
          <View style={styles.successButton}>
            <PrimaryButton label="Go to Dashboard" onPress={onDashboard} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.appShell}>
      <ScrollView contentContainerStyle={styles.formContent}>
        <View style={styles.topRow}>
          <IconButton label="‹" onPress={onBack} />
          <Text style={styles.mutedSmall}>Step 1 of 1</Text>
        </View>
        <Text style={styles.screenTitle}>Create your account</Text>
        <Text style={styles.screenSubtitle}>Start your training journey in under a minute.</Text>
        <InputField
          label="Full name"
          value={form.name}
          placeholder="Fabian Hartmann"
          onChangeText={(name) => onChange({ ...form, name })}
        />
        <InputField
          label="Email"
          value={form.email}
          placeholder="fabian@workout.app"
          onChangeText={(email) => onChange({ ...form, email })}
        />
        <InputField
          label="Password"
          value={form.password}
          placeholder="At least 8 characters"
          secureTextEntry
          onChangeText={(password) => onChange({ ...form, password })}
        />
        <View>
          <Text style={styles.fieldLabel}>Training goal</Text>
          <View style={styles.goalWrap}>
            {goals.map((goal) => (
              <Pressable
                key={goal}
                onPress={() => onChange({ ...form, goal })}
                style={[styles.goalChip, form.goal === goal && styles.goalChipActive]}
              >
                <Text style={[styles.goalChipText, form.goal === goal && styles.goalChipTextActive]}>
                  {goal}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        <PrimaryButton label="Create Account" onPress={onSubmit} disabled={!canSubmit} />
        <Pressable onPress={onDashboard}>
          <Text style={styles.centerLink}>Already a member? Sign in</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function DashboardScreen({
  onOpenWorkout,
  onNavigate
}: {
  onOpenWorkout: (id: string) => void;
  onNavigate: (screen: Screen) => void;
}) {
  return (
    <ScreenScroll>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={styles.screenTitle}>Good morning, Fabian</Text>
          <Text style={styles.screenSubtitle}>Ready for your next session?</Text>
        </View>
        <View style={styles.headerActions}>
          <IconButton label="⌕" />
          <IconButton label="FH" />
        </View>
      </View>
      <HeroProgress />
      <SectionHeader title="Upcoming Workouts" action="See all" onPress={() => onNavigate('workouts')} />
      <View style={styles.cardStack}>
        {workouts.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} onPress={() => onOpenWorkout(workout.id)} />
        ))}
      </View>
      <SectionHeader title="Quick focus" />
      <View style={styles.twoColumn}>
        <MiniFocusCard title="Recovery" subtitle="12 min" icon="♡" />
        <MiniFocusCard title="Mobility" subtitle="15 min" icon="↯" />
      </View>
    </ScreenScroll>
  );
}

function WorkoutsScreen({ onOpenWorkout }: { onOpenWorkout: (id: string) => void }) {
  const [filter, setFilter] = useState<'All' | WorkoutLevel>('All');
  const filtered = filter === 'All' ? workouts : workouts.filter((workout) => workout.level === filter);

  return (
    <ScreenScroll>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={styles.screenTitle}>Workouts</Text>
          <Text style={styles.screenSubtitle}>Curated for your goal: build strength</Text>
        </View>
        <IconButton label="⌕" />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((item) => (
          <Pressable
            key={item}
            onPress={() => setFilter(item)}
            style={[styles.filterChip, filter === item && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.cardStack}>
        {filtered.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} onPress={() => onOpenWorkout(workout.id)} />
        ))}
      </View>
    </ScreenScroll>
  );
}

function WorkoutDetailScreen({
  workout,
  isSaved,
  onBack,
  onSave,
  onStart
}: {
  workout: Workout;
  isSaved: boolean;
  onBack: () => void;
  onSave: () => void;
  onStart: () => void;
}) {
  return (
    <View style={styles.flex}>
      <View style={styles.detailHeader}>
        <View style={styles.topRow}>
          <IconButton label="‹" onPress={onBack} />
          <IconButton label={isSaved ? '★' : '☆'} onPress={onSave} />
        </View>
        <View style={styles.detailTitleRow}>
          <WorkoutGlyph focus={workout.focus} large />
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>{workout.focus}</Text>
            <Text style={styles.detailTitle}>{workout.title}</Text>
          </View>
        </View>
        <View style={styles.metaRow}>
          <Chip label={`${workout.duration} min`} />
          <DifficultyBadge level={workout.level} />
          <Chip label={`${workout.kcal} kcal`} />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.detailBody}>
        <DetailBlock title="Overview">
          <Text style={styles.bodyText}>{workout.summary}</Text>
        </DetailBlock>
        <DetailBlock title="Exercises" suffix={`${workout.exercises.length} moves`}>
          {workout.exercises.map((exercise, index) => (
            <View key={exercise.name} style={styles.exerciseRow}>
              <View style={styles.exerciseNumber}>
                <Text style={styles.exerciseNumberText}>{String(index + 1).padStart(2, '0')}</Text>
              </View>
              <View style={styles.headerCopy}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseMeta}>
                  {exercise.tag} · rest {exercise.rest}
                </Text>
              </View>
              <Text style={styles.exerciseSets}>{exercise.sets}</Text>
            </View>
          ))}
        </DetailBlock>
        <DetailBlock title="Equipment">
          <View style={styles.goalWrap}>
            {workout.equipment.map((item) => (
              <View key={item} style={styles.softChip}>
                <Text style={styles.softChipText}>{item}</Text>
              </View>
            ))}
          </View>
        </DetailBlock>
        <DetailBlock title="Trainer notes">
          <View style={styles.noteBox}>
            <Text style={styles.noteText}>{workout.notes}</Text>
          </View>
        </DetailBlock>
      </ScrollView>
      <View style={styles.stickyCta}>
        <PrimaryButton label="Start Workout" onPress={onStart} />
        <SecondaryButton label={isSaved ? 'Saved for later' : 'Save for later'} onPress={onSave} ghost />
      </View>
    </View>
  );
}

function ProgressScreen() {
  const minutes = [38, 0, 52, 22, 45, 0, 27];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const max = 60;

  return (
    <ScreenScroll>
      <Text style={styles.screenTitle}>Progress</Text>
      <Text style={styles.screenSubtitle}>Week of May 11</Text>
      <View style={styles.chartCard}>
        <View style={styles.sectionTopRow}>
          <Text style={styles.eyebrow}>Active minutes</Text>
          <Text style={styles.monoMuted}>184 / 240 min</Text>
        </View>
        <View style={styles.chartRow}>
          {minutes.map((minute, index) => (
            <View key={days[index]} style={styles.chartColumn}>
              <Text style={[styles.chartValue, minute === 0 && styles.chartValueHidden]}>{minute || '·'}</Text>
              <View
                style={[
                  styles.chartBar,
                  { height: Math.max(8, (minute / max) * 110) },
                  minute === 0 && styles.chartBarRest,
                  index === 4 && styles.chartBarToday
                ]}
              />
              <Text style={[styles.chartDay, index === 4 && styles.chartDayToday]}>{days[index]}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.statsGrid}>
        <StatCard label="Workouts" value="14" sublabel="this month" />
        <StatCard label="Total minutes" value="486" sublabel="+12% vs last" />
        <StatCard label="Current streak" value="12 d" sublabel="best: 24 d" />
        <StatCard label="Avg difficulty" value="Mod" sublabel="RPE 6.4" />
      </View>
      <SectionHeader title="Recent sessions" action="History" />
      <View style={styles.listPanel}>
        {recentSessions.map((session) => (
          <View key={`${session.date}-${session.title}`} style={styles.recentRow}>
            <View style={styles.dateBox}>
              <Text style={styles.dateBoxText}>{session.date.slice(0, 3)}</Text>
            </View>
            <View style={styles.headerCopy}>
              <Text style={styles.exerciseName}>{session.title}</Text>
              <Text style={styles.exerciseMeta}>
                {session.date} · {session.duration} min
              </Text>
            </View>
            <DifficultyBadge level={session.level} small />
          </View>
        ))}
      </View>
    </ScreenScroll>
  );
}

function HealthScreen({
  endpoint,
  status,
  message,
  lastChecked,
  latency,
  onRun
}: {
  endpoint: string;
  status: HealthStatus;
  message: string;
  lastChecked: string;
  latency: number | null;
  onRun: () => void;
}) {
  const rows = [
    { label: 'Auth /v1/settings', state: status },
    { label: 'Postgres pool', state: status === 'UNHEALTHY' ? 'IDLE' : status },
    { label: 'Edge function: log', state: status },
    { label: 'Realtime channel', state: status === 'UNHEALTHY' ? 'LOADING' : status }
  ] as const;

  return (
    <ScreenScroll>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={styles.screenTitle}>Health</Text>
          <Text style={styles.screenSubtitle}>Verify Supabase connectivity</Text>
        </View>
        <HealthPill status={status} />
      </View>
      <View style={styles.endpointCard}>
        <Text style={styles.eyebrow}>Endpoint</Text>
        <View style={styles.endpointBox}>
          <Text style={styles.methodText}>GET</Text>
          <Text style={styles.endpointText} numberOfLines={2}>
            {endpoint}
          </Text>
        </View>
        <View style={styles.sectionTopRow}>
          <Text style={styles.monoMuted}>last: {lastChecked || '-'}</Text>
          <Text style={styles.monoMuted}>latency: {latency == null ? '-' : `${latency} ms`}</Text>
        </View>
      </View>
      <PrimaryButton label={status === 'LOADING' ? 'Running...' : 'Run Health Check'} onPress={onRun} disabled={status === 'LOADING'} />
      <View>
        <Text style={styles.eyebrow}>Pill states</Text>
        <View style={styles.statusWrap}>
          {(['IDLE', 'LOADING', 'HEALTHY', 'UNHEALTHY'] as const).map((item) => (
            <HealthPill key={item} status={item} />
          ))}
        </View>
      </View>
      <View style={styles.listPanel}>
        {rows.map((row) => (
          <View key={row.label} style={styles.subsystemRow}>
            <HealthDot status={row.state} />
            <Text style={styles.subsystemText}>{row.label}</Text>
            <Text style={styles.subsystemCode}>
              {row.state === 'HEALTHY' ? '200 OK' : row.state === 'UNHEALTHY' ? '503' : row.state === 'LOADING' ? '...' : '-'}
            </Text>
          </View>
        ))}
      </View>
      <Text style={styles.healthMessage}>{message}</Text>
    </ScreenScroll>
  );
}

function ProfileScreen({ savedCount }: { savedCount: number }) {
  return (
    <ScreenScroll>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>FH</Text>
        </View>
        <View style={styles.headerCopy}>
          <Text style={styles.profileName}>Fabian Hartmann</Text>
          <Text style={styles.screenSubtitle}>fabian@workout.app · Pro</Text>
        </View>
      </View>
      <View style={styles.profileStats}>
        <StatTiny label="Sessions" value="146" />
        <StatTiny label="Hours" value="92" />
        <StatTiny label="Saved" value={String(savedCount)} />
      </View>
      <Text style={styles.eyebrow}>Preferences</Text>
      <View style={styles.listPanel}>
        <PreferenceRow label="Training goal" value="Build strength" />
        <PreferenceRow label="Weekly target" value="5 sessions" />
        <PreferenceRow label="Reminder time" value="07:30" />
        <PreferenceRow label="Units" value="Metric · kg" />
      </View>
    </ScreenScroll>
  );
}

function ActiveWorkoutScreen({ workout, onDone }: { workout: Workout; onDone: () => void }) {
  return (
    <ScreenScroll>
      <Text style={styles.eyebrow}>Active session</Text>
      <Text style={styles.screenTitle}>{workout.title}</Text>
      <Text style={styles.screenSubtitle}>Stay controlled. Rest when the timer says rest.</Text>
      <View style={styles.timerCard}>
        <Text style={styles.timerText}>32:14</Text>
        <Text style={styles.screenSubtitle}>estimated remaining</Text>
      </View>
      <View style={styles.cardStack}>
        {workout.exercises.slice(0, 3).map((exercise, index) => (
          <View key={exercise.name} style={styles.exerciseRow}>
            <View style={styles.exerciseNumber}>
              <Text style={styles.exerciseNumberText}>{String(index + 1).padStart(2, '0')}</Text>
            </View>
            <View style={styles.headerCopy}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseMeta}>{exercise.sets}</Text>
            </View>
          </View>
        ))}
      </View>
      <PrimaryButton label="Finish Workout" onPress={onDone} />
    </ScreenScroll>
  );
}

function ScreenScroll({ children }: { children: React.ReactNode }) {
  return <ScrollView contentContainerStyle={styles.screenContent}>{children}</ScrollView>;
}

function BottomTabs({ active, onNavigate }: { active: Screen; onNavigate: (screen: Screen) => void }) {
  return (
    <View style={styles.tabBarHost}>
      <DSBottomTabs active={active} onNavigate={(tab) => onNavigate(tab)} />
    </View>
  );
}

function PrimaryButton({
  label,
  onPress,
  disabled
}: {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
}) {
  return <WorkoutButton label={label} onPress={onPress} disabled={disabled} />;
}

function SecondaryButton({
  label,
  onPress,
  ghost
}: {
  label: string;
  onPress?: () => void;
  ghost?: boolean;
}) {
  return <WorkoutButton label={label} onPress={onPress} variant={ghost ? 'ghost' : 'secondary'} />;
}

function WorkoutCard({ workout, onPress }: { workout: Workout; onPress: () => void }) {
  return <DesignWorkoutCard workout={workout} onPress={onPress} />;
}

function DifficultyBadge({ level, small }: { level: WorkoutLevel; small?: boolean }) {
  return <DSDifficultyBadge level={level} small={small} />;
}

function HealthPill({ status }: { status: HealthStatus }) {
  return <DSHealthPill status={status} />;
}

function HealthDot({ status }: { status: HealthStatus }) {
  return <DSHealthDot status={status} />;
}

function WorkoutGlyph({ focus, large }: { focus: string; large?: boolean }) {
  return <DSWorkoutGlyph focus={focus} large={large} />;
}

function HeroProgress() {
  return <DSHeroProgress />;
}

function HeroStat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <View>
      <Text style={styles.heroStatLabel}>{label}</Text>
      <Text style={styles.heroStatValue}>
        {value}
        {unit ? <Text style={styles.heroStatUnit}> {unit}</Text> : null}
      </Text>
    </View>
  );
}

function BenefitCard({ icon, title, body }: { icon: string; title: string; body: string }) {
  return <DSBenefitCard icon={icon} title={title} body={body} />;
}

function SectionHeader({
  title,
  action,
  onPress
}: {
  title: string;
  action?: string;
  onPress?: () => void;
}) {
  return <DSSectionHeader title={title} action={action} onPress={onPress} />;
}

function DetailBlock({
  title,
  suffix,
  children
}: {
  title: string;
  suffix?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.detailBlock}>
      <View style={styles.sectionTopRow}>
        <Text style={styles.eyebrow}>{title}</Text>
        {suffix ? <Text style={styles.mutedSmall}>{suffix}</Text> : null}
      </View>
      <View style={styles.detailBlockCard}>{children}</View>
    </View>
  );
}

function StatCard({ label, value, sublabel }: { label: string; value: string; sublabel: string }) {
  return <DSStatCard label={label} value={value} sublabel={sublabel} />;
}

function StatTiny({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statTiny}>
      <Text style={styles.statTinyValue}>{value}</Text>
      <Text style={styles.statTinyLabel}>{label}</Text>
    </View>
  );
}

function PreferenceRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.preferenceRow}>
      <View style={styles.preferenceIcon}>
        <Text style={styles.preferenceIconText}>◦</Text>
      </View>
      <Text style={styles.preferenceLabel}>{label}</Text>
      <Text style={styles.preferenceValue}>{value}</Text>
      <Text style={styles.preferenceChevron}>›</Text>
    </View>
  );
}

function MiniFocusCard({ title, subtitle, icon }: { title: string; subtitle: string; icon: string }) {
  return (
    <View style={styles.focusCard}>
      <View style={styles.focusIcon}>
        <Text style={styles.focusIconText}>{icon}</Text>
      </View>
      <Text style={styles.focusTitle}>{title}</Text>
      <Text style={styles.screenSubtitle}>{subtitle}</Text>
    </View>
  );
}

function InputField({
  label,
  value,
  placeholder,
  secureTextEntry,
  onChangeText
}: {
  label: string;
  value: string;
  placeholder: string;
  secureTextEntry?: boolean;
  onChangeText: (value: string) => void;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        placeholder={placeholder}
        placeholderTextColor={colors.textSoft}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        style={styles.input}
      />
    </View>
  );
}

function IconButton({ label, onPress }: { label: string; onPress?: () => void }) {
  return <DSIconButton label={label} onPress={onPress} />;
}

function Chip({ label }: { label: string }) {
  return <DSChip label={label} />;
}

function MiniLogo() {
  return (
    <View style={styles.miniLogo}>
      <View style={styles.miniLogoBar} />
      <View style={[styles.miniLogoBar, styles.miniLogoBarTall]} />
      <View style={styles.miniLogoBar} />
    </View>
  );
}

const colors = {
  bg: '#F6F2EA',
  bgDeep: '#EBE5D8',
  surface: '#FFFFFF',
  surfaceAlt: '#FBF8F2',
  text: '#15181C',
  textMuted: '#4B5057',
  textSoft: '#6B6F73',
  border: 'rgba(20,24,28,0.08)',
  borderStrong: 'rgba(20,24,28,0.14)',
  accent: '#5ACDBD',
  accentDeep: '#1D655F',
  accentSoft: '#E4F8F4',
  accentInk: '#0B1410'
};

const styles = StyleSheet.create({
  appShell: {
    flex: 1,
    backgroundColor: colors.bg
  },
  phoneRoot: {
    flex: 1,
    backgroundColor: colors.bg
  },
  flex: {
    flex: 1
  },
  splash: {
    flex: 1,
    backgroundColor: colors.bg
  },
  splashPressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  logoTile: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 5
  },
  pulseLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  pulseShort: {
    width: 8,
    height: 28,
    borderRadius: 999,
    backgroundColor: colors.accentDeep
  },
  pulseTall: {
    width: 8,
    height: 52,
    borderRadius: 999,
    backgroundColor: colors.accent
  },
  pulseMid: {
    width: 8,
    height: 38,
    borderRadius: 999,
    backgroundColor: colors.accentDeep
  },
  splashTitle: {
    marginTop: 24,
    fontSize: 30,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.8
  },
  splashTagline: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 0.4
  },
  splashFooter: {
    position: 'absolute',
    bottom: 56,
    alignItems: 'center',
    gap: 10
  },
  loadingRing: {
    width: 36,
    height: 36,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: colors.accent
  },
  monoMuted: {
    fontSize: 11,
    color: colors.textSoft,
    fontWeight: '600'
  },
  onboardingContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 48,
    gap: 28
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  skipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted
  },
  miniLogo: {
    width: 30,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3
  },
  miniLogoBar: {
    width: 5,
    height: 18,
    borderRadius: 999,
    backgroundColor: colors.accentDeep
  },
  miniLogoBarTall: {
    height: 28,
    backgroundColor: colors.accent
  },
  heroTitle: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -1
  },
  heroBody: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 23,
    color: colors.textMuted,
    maxWidth: 310
  },
  benefitList: {
    gap: 12
  },
  benefitCard: {
    flexDirection: 'row',
    gap: 14,
    padding: 16,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  benefitIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center'
  },
  benefitIconText: {
    color: colors.accentDeep,
    fontWeight: '800',
    fontSize: 18
  },
  benefitTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text
  },
  benefitBody: {
    marginTop: 3,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textMuted
  },
  buttonStack: {
    marginTop: 'auto',
    gap: 10
  },
  formContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 48,
    gap: 16
  },
  screenContent: {
    padding: 20,
    paddingTop: 54,
    paddingBottom: 112,
    gap: 18
  },
  screenTitle: {
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.5
  },
  screenSubtitle: {
    fontSize: 13.5,
    lineHeight: 20,
    color: colors.textMuted
  },
  mutedSmall: {
    fontSize: 12,
    color: colors.textSoft,
    fontWeight: '600'
  },
  fieldLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '700',
    marginBottom: 7
  },
  inputGroup: {
    gap: 4
  },
  input: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.text
  },
  goalWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  goalChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  goalChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent
  },
  goalChipText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600'
  },
  goalChipTextActive: {
    color: colors.accentInk
  },
  centerLink: {
    textAlign: 'center',
    color: colors.accentDeep,
    fontWeight: '700'
  },
  successScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  successMark: {
    width: 88,
    height: 88,
    borderRadius: 999,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center'
  },
  successCheck: {
    fontSize: 44,
    fontWeight: '800',
    color: colors.accentInk
  },
  successTitle: {
    marginTop: 18,
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.8,
    textAlign: 'center'
  },
  successBody: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: colors.textMuted,
    textAlign: 'center',
    maxWidth: 290
  },
  successButton: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 34
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 14
  },
  headerCopy: {
    flex: 1,
    minWidth: 0
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800'
  },
  primaryButton: {
    minHeight: 56,
    borderRadius: 999,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  primaryButtonText: {
    color: colors.accentInk,
    fontSize: 16,
    fontWeight: '800'
  },
  buttonDisabled: {
    backgroundColor: 'rgba(20,24,28,0.12)'
  },
  buttonDisabledText: {
    color: colors.textSoft
  },
  secondaryButton: {
    minHeight: 56,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  secondaryButtonGhost: {
    backgroundColor: 'transparent',
    borderWidth: 0
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700'
  },
  heroCard: {
    padding: 18,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  heroValue: {
    marginTop: 4,
    fontSize: 30,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -1
  },
  heroMuted: {
    color: colors.textSoft,
    fontWeight: '600'
  },
  progressRing: {
    width: 72,
    height: 72,
    borderRadius: 999,
    borderWidth: 8,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentSoft
  },
  progressRingText: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 14
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  heroStatLabel: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  heroStatValue: {
    marginTop: 4,
    color: colors.text,
    fontSize: 20,
    fontWeight: '800'
  },
  heroStatUnit: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600'
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 4
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.2
  },
  sectionAction: {
    fontSize: 13,
    color: colors.accentDeep,
    fontWeight: '700'
  },
  cardStack: {
    gap: 10
  },
  workoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  workoutCardBody: {
    flex: 1,
    minWidth: 0,
    gap: 5
  },
  workoutTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2
  },
  eyebrow: {
    fontSize: 11.5,
    color: colors.textSoft,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap'
  },
  metaText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600'
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 999,
    backgroundColor: colors.borderStrong
  },
  chevronCircle: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: colors.bgDeep,
    alignItems: 'center',
    justifyContent: 'center'
  },
  chevronText: {
    color: colors.text,
    fontSize: 24,
    lineHeight: 24
  },
  glyph: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  glyphLarge: {
    width: 56,
    height: 56
  },
  glyphLower: {
    backgroundColor: colors.accent
  },
  glyphCore: {
    backgroundColor: '#EEC85C'
  },
  glyphAthletic: {
    backgroundColor: '#D7745B'
  },
  glyphText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -3
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999
  },
  badgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  badgeBeginner: {
    backgroundColor: '#E4F8ED'
  },
  badgeIntermediate: {
    backgroundColor: '#F6EDCF'
  },
  badgeAdvanced: {
    backgroundColor: '#F6DDD7'
  },
  badgeDot: {
    width: 5,
    height: 5,
    borderRadius: 999
  },
  dotBeginner: {
    backgroundColor: '#2C7A4B'
  },
  dotIntermediate: {
    backgroundColor: '#8A6320'
  },
  dotAdvanced: {
    backgroundColor: '#9B3F2C'
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase'
  },
  textBeginner: {
    color: '#2C7A4B'
  },
  textIntermediate: {
    color: '#8A6320'
  },
  textAdvanced: {
    color: '#9B3F2C'
  },
  twoColumn: {
    flexDirection: 'row',
    gap: 10
  },
  focusCard: {
    flex: 1,
    padding: 14,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10
  },
  focusIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center'
  },
  focusIconText: {
    color: colors.accentDeep,
    fontSize: 18,
    fontWeight: '900'
  },
  focusTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800'
  },
  detailHeader: {
    padding: 20,
    paddingTop: 52,
    gap: 16,
    backgroundColor: colors.surfaceAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  detailTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14
  },
  detailTitle: {
    marginTop: 2,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  chipText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700'
  },
  detailBody: {
    padding: 20,
    paddingBottom: 176,
    gap: 18
  },
  detailBlock: {
    gap: 10
  },
  sectionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },
  detailBlockCard: {
    padding: 14,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  bodyText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 22
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  exerciseNumber: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.bgDeep,
    alignItems: 'center',
    justifyContent: 'center'
  },
  exerciseNumberText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '900'
  },
  exerciseName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800'
  },
  exerciseMeta: {
    marginTop: 2,
    color: colors.textSoft,
    fontSize: 12
  },
  exerciseSets: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800'
  },
  softChip: {
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: colors.bgDeep
  },
  softChipText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700'
  },
  noteBox: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.accentSoft
  },
  noteText: {
    color: colors.accentDeep,
    fontSize: 13.5,
    lineHeight: 21,
    fontWeight: '600'
  },
  stickyCta: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    paddingBottom: 84,
    gap: 8,
    backgroundColor: colors.bg
  },
  filterRow: {
    gap: 8,
    paddingRight: 12
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  filterChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent
  },
  filterText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 13
  },
  filterTextActive: {
    color: colors.accentInk
  },
  chartCard: {
    padding: 18,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  chartRow: {
    height: 150,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    marginTop: 10
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6
  },
  chartValue: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700'
  },
  chartValueHidden: {
    color: 'transparent'
  },
  chartBar: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: '#BFEDE5'
  },
  chartBarRest: {
    backgroundColor: colors.bgDeep
  },
  chartBarToday: {
    backgroundColor: colors.accent
  },
  chartDay: {
    color: colors.textSoft,
    fontSize: 10.5,
    fontWeight: '800'
  },
  chartDayToday: {
    color: colors.text
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  statCard: {
    width: '48.4%',
    minHeight: 102,
    padding: 14,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8
  },
  statValue: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.8
  },
  listPanel: {
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden'
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  dateBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.bgDeep,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dateBoxText: {
    color: colors.textMuted,
    fontSize: 10.5,
    fontWeight: '900'
  },
  endpointCard: {
    gap: 10,
    padding: 14,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  endpointBox: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.bgDeep
  },
  methodText: {
    fontSize: 11,
    color: colors.accentDeep,
    fontWeight: '900'
  },
  endpointText: {
    flex: 1,
    color: colors.text,
    fontSize: 12,
    fontWeight: '600'
  },
  statusWrap: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  healthPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 999
  },
  healthIdle: {
    backgroundColor: '#E9EAEC'
  },
  healthLoading: {
    backgroundColor: '#F6EDCF'
  },
  healthHealthy: {
    backgroundColor: '#E4F8ED'
  },
  healthUnhealthy: {
    backgroundColor: '#F6DDD7'
  },
  healthPillText: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.text
  },
  healthDot: {
    width: 7,
    height: 7,
    borderRadius: 999
  },
  healthDotIdle: {
    backgroundColor: '#55595F'
  },
  healthDotLoading: {
    backgroundColor: '#8A6320'
  },
  healthDotHealthy: {
    backgroundColor: '#2C7A4B'
  },
  healthDotUnhealthy: {
    backgroundColor: '#9B3F2C'
  },
  subsystemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  subsystemText: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
    fontWeight: '700'
  },
  subsystemCode: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: '900'
  },
  healthMessage: {
    color: colors.textMuted,
    fontSize: 13.5,
    lineHeight: 20
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    color: colors.accentInk,
    fontSize: 22,
    fontWeight: '900'
  },
  profileName: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800'
  },
  profileStats: {
    flexDirection: 'row',
    gap: 10
  },
  statTiny: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  statTinyValue: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900'
  },
  statTinyLabel: {
    marginTop: 2,
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  preferenceIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center'
  },
  preferenceIconText: {
    color: colors.accentDeep,
    fontWeight: '900'
  },
  preferenceLabel: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontWeight: '700'
  },
  preferenceValue: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600'
  },
  preferenceChevron: {
    color: colors.textSoft,
    fontSize: 18
  },
  timerCard: {
    padding: 24,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 6
  },
  timerText: {
    color: colors.text,
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -1.5
  },
  tabBarHost: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12
  },
  tabBar: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    height: 68,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3
  },
  tabIcon: {
    color: colors.textSoft,
    fontSize: 18,
    fontWeight: '900'
  },
  tabIconActive: {
    color: colors.accentDeep
  },
  tabLabel: {
    color: colors.textSoft,
    fontSize: 10.5,
    fontWeight: '800'
  },
  tabLabelActive: {
    color: colors.accentDeep
  }
});
