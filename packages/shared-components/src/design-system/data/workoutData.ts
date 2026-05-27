export type WorkoutLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type HealthStatus = 'IDLE' | 'LOADING' | 'HEALTHY' | 'UNHEALTHY';

export interface WorkoutExercise {
  name: string;
  sets: string;
  rest: string;
  tag: string;
}

export interface Workout {
  id: string;
  title: string;
  duration: number;
  level: WorkoutLevel;
  focus: string;
  kcal: number;
  summary: string;
  equipment: string[];
  notes: string;
  exercises: WorkoutExercise[];
}

export const workoutFixtures: Workout[] = [
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

export const recentSessionFixtures = [
  { date: 'Yesterday', title: 'Upper Body Push', duration: 42, level: 'Intermediate' as const },
  { date: '3 days ago', title: 'Mobility Reset', duration: 18, level: 'Beginner' as const },
  { date: 'Apr 26', title: 'Tempo Run', duration: 35, level: 'Intermediate' as const },
  { date: 'Apr 24', title: 'Athlete Conditioning', duration: 58, level: 'Advanced' as const }
];

export const goalFixtures = ['Build strength', 'Endurance', 'Lose weight', 'Move better', 'Sport-specific'];
