import { StyleSheet, Text, View } from 'react-native';

import { WorkoutButton } from '../atoms/Button';
import { HealthDot, HealthPill } from '../atoms/HealthPill';
import type { HealthStatus } from '../data/workoutData';
import { workoutColors, workoutTypography } from '../tokens';

export interface HealthScreenProps {
  endpoint?: string;
  status?: HealthStatus;
  message?: string;
}

export function HealthScreen({
  endpoint = 'https://project.supabase.co/auth/v1/settings',
  status = 'IDLE',
  message = 'No check has run yet.'
}: HealthScreenProps) {
  const rows = ['Auth /v1/settings', 'Postgres pool', 'Edge function: log', 'Realtime channel'];

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={workoutTypography.title}>Health</Text>
          <Text style={workoutTypography.subtitle}>Verify Supabase connectivity</Text>
        </View>
        <HealthPill status={status} />
      </View>
      <View style={styles.card}>
        <Text style={workoutTypography.eyebrow}>Endpoint</Text>
        <View style={styles.endpoint}>
          <Text style={styles.method}>GET</Text>
          <Text style={styles.endpointText} numberOfLines={2}>
            {endpoint}
          </Text>
        </View>
      </View>
      <WorkoutButton label={status === 'LOADING' ? 'Running...' : 'Run Health Check'} disabled={status === 'LOADING'} />
      <View style={styles.statusWrap}>
        {(['IDLE', 'LOADING', 'HEALTHY', 'UNHEALTHY'] as const).map((item) => (
          <HealthPill key={item} status={item} />
        ))}
      </View>
      <View style={styles.list}>
        {rows.map((row) => (
          <View key={row} style={styles.row}>
            <HealthDot status={status} />
            <Text style={styles.rowLabel}>{row}</Text>
            <Text style={styles.rowCode}>{status === 'HEALTHY' ? '200 OK' : status === 'UNHEALTHY' ? '503' : '-'}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    width: 390,
    padding: 20,
    paddingTop: 54,
    gap: 18,
    backgroundColor: workoutColors.bg
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 14
  },
  card: {
    gap: 10,
    padding: 14,
    borderRadius: 22,
    backgroundColor: workoutColors.surface,
    borderWidth: 1,
    borderColor: workoutColors.border
  },
  endpoint: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: workoutColors.bgDeep
  },
  method: {
    fontSize: 11,
    color: workoutColors.accentDeep,
    fontWeight: '900'
  },
  endpointText: {
    flex: 1,
    color: workoutColors.text,
    fontSize: 12,
    fontWeight: '600'
  },
  statusWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  list: {
    borderRadius: 22,
    backgroundColor: workoutColors.surface,
    borderWidth: 1,
    borderColor: workoutColors.border,
    overflow: 'hidden'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: workoutColors.border
  },
  rowLabel: {
    flex: 1,
    color: workoutColors.text,
    fontSize: 13,
    fontWeight: '700'
  },
  rowCode: {
    color: workoutColors.textSoft,
    fontSize: 11,
    fontWeight: '900'
  },
  message: {
    ...workoutTypography.subtitle
  }
});
