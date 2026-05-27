import type { TextStyle } from 'react-native';

export const workoutColors = {
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
  accentInk: '#0B1410',
  beginnerBg: '#E4F8ED',
  beginnerFg: '#2C7A4B',
  intermediateBg: '#F6EDCF',
  intermediateFg: '#8A6320',
  advancedBg: '#F6DDD7',
  advancedFg: '#9B3F2C',
  idleBg: '#E9EAEC',
  idleFg: '#55595F'
} as const;

export const workoutSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  screenX: 20,
  tabBottom: 112
} as const;

export const workoutRadius = {
  sm: 10,
  md: 14,
  lg: 22,
  xl: 28,
  pill: 999
} as const;

export const workoutTypography = {
  eyebrow: {
    fontSize: 11.5,
    color: workoutColors.textSoft,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4
  } satisfies TextStyle,
  title: {
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '700',
    color: workoutColors.text,
    letterSpacing: -0.5
  } satisfies TextStyle,
  subtitle: {
    fontSize: 13.5,
    lineHeight: 20,
    color: workoutColors.textMuted
  } satisfies TextStyle,
  body: {
    fontSize: 14,
    lineHeight: 22,
    color: workoutColors.textMuted
  } satisfies TextStyle
} as const;

export const workoutTheme = {
  colors: workoutColors,
  spacing: workoutSpacing,
  radius: workoutRadius,
  typography: workoutTypography
} as const;

export type WorkoutTheme = typeof workoutTheme;
