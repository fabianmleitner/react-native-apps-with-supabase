import { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { WorkoutCard } from '@workout/shared-components';

const adminPreview = [
  {
    id: 'plan-001',
    title: 'Starter Strength Plan',
    durationInMinutes: 30,
    difficulty: 'Beginner'
  },
  {
    id: 'plan-002',
    title: 'Performance Split',
    durationInMinutes: 55,
    difficulty: 'Advanced'
  }
] as const;

type HealthStatus = 'idle' | 'loading' | 'healthy' | 'unhealthy';

function getCurrentPathname(): string {
  const maybeWindow = globalThis as { window?: { location?: { pathname?: string } } };
  return maybeWindow.window?.location?.pathname ?? '/';
}

function setPathname(pathname: string): void {
  const maybeWindow = globalThis as {
    window?: {
      history?: { pushState: (data: unknown, title: string, url?: string | URL | null) => void };
      dispatchEvent?: (event: Event) => boolean;
    };
  };

  if (!maybeWindow.window?.history?.pushState || !maybeWindow.window.dispatchEvent) {
    return;
  }

  maybeWindow.window.history.pushState({}, '', pathname);
  maybeWindow.window.dispatchEvent(new Event('popstate'));
}

export default function App() {
  const [pathname, setPathnameState] = useState(getCurrentPathname());
  const [healthStatus, setHealthStatus] = useState<HealthStatus>('idle');
  const [healthMessage, setHealthMessage] = useState('Noch kein Check ausgefuehrt.');

  const healthEndpoint = useMemo(() => {
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl) {
      return null;
    }

    return `${supabaseUrl}/auth/v1/settings`;
  }, []);

  useEffect(() => {
    const maybeWindow = globalThis as {
      window?: {
        addEventListener?: (type: string, listener: () => void) => void;
        removeEventListener?: (type: string, listener: () => void) => void;
      };
    };

    const syncPath = () => setPathnameState(getCurrentPathname());

    maybeWindow.window?.addEventListener?.('popstate', syncPath);

    return () => {
      maybeWindow.window?.removeEventListener?.('popstate', syncPath);
    };
  }, []);

  async function runHealthCheck() {
    if (!healthEndpoint) {
      setHealthStatus('unhealthy');
      setHealthMessage('EXPO_PUBLIC_SUPABASE_URL fehlt. Bitte in der Admin-App konfigurieren.');
      return;
    }

    const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    try {
      setHealthStatus('loading');
      setHealthMessage('Verbindung wird geprueft...');

      const response = await fetch(healthEndpoint, {
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

      const payload = (await response.json()) as { ok?: boolean; message?: string; error?: string; code?: string };

      if (!response.ok || payload.ok === false) {
        setHealthStatus('unhealthy');
        setHealthMessage(payload.error ?? payload.message ?? payload.code ?? `Health-Check fehlgeschlagen. HTTP ${response.status}`);
        return;
      }

      setHealthStatus('healthy');
      setHealthMessage(payload.message ?? 'Verbindung zur Supabase API ist gesund.');
    } catch {
      setHealthStatus('unhealthy');
      setHealthMessage('Verbindung konnte nicht hergestellt werden.');
    }
  }

  const isHealthPage = pathname === '/health';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.navigationRow}>
          <Pressable onPress={() => setPathname('/')} style={[styles.navButton, !isHealthPage && styles.navButtonActive]}>
            <Text style={[styles.navButtonText, !isHealthPage && styles.navButtonTextActive]}>Dashboard</Text>
          </Pressable>
          <Pressable onPress={() => setPathname('/health')} style={[styles.navButton, isHealthPage && styles.navButtonActive]}>
            <Text style={[styles.navButtonText, isHealthPage && styles.navButtonTextActive]}>Health</Text>
          </Pressable>
        </View>

        {!isHealthPage ? (
          <>
            <Text style={styles.heading}>Admin App</Text>
            <Text style={styles.subheading}>Web-Frontend fuer Planung, Kuration und Verwaltung von Workout-Inhalten.</Text>
            <View style={styles.grid}>
              {adminPreview.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  title={workout.title}
                  durationInMinutes={workout.durationInMinutes}
                  difficulty={workout.difficulty}
                />
              ))}
            </View>
          </>
        ) : (
          <View style={styles.healthCard}>
            <Text style={styles.heading}>Health Page</Text>
            <Text style={styles.subheading}>Prueft die Erreichbarkeit der Supabase API vom Admin-Client.</Text>
            <Text style={styles.label}>Endpoint</Text>
            <Text style={styles.endpointText}>{healthEndpoint ?? 'Nicht konfiguriert'}</Text>
            <View style={styles.statusRow}>
              <Text style={styles.label}>Status</Text>
              <Text
                style={[
                  styles.statusPill,
                  healthStatus === 'healthy' && styles.statusHealthy,
                  healthStatus === 'unhealthy' && styles.statusUnhealthy,
                  healthStatus === 'loading' && styles.statusLoading
                ]}
              >
                {healthStatus.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.healthMessage}>{healthMessage}</Text>
            <Pressable onPress={runHealthCheck} style={styles.healthButton}>
              <Text style={styles.healthButtonText}>Health-Check ausfuehren</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffaf2'
  },
  content: {
    padding: 32,
    gap: 24
  },
  navigationRow: {
    flexDirection: 'row',
    gap: 12
  },
  navButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#ffffff'
  },
  navButtonActive: {
    backgroundColor: '#111827',
    borderColor: '#111827'
  },
  navButtonText: {
    color: '#374151',
    fontWeight: '600'
  },
  navButtonTextActive: {
    color: '#ffffff'
  },
  heading: {
    fontSize: 34,
    fontWeight: '700',
    color: '#111827'
  },
  subheading: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4b5563',
    maxWidth: 720
  },
  grid: {
    gap: 16,
    maxWidth: 720
  },
  healthCard: {
    maxWidth: 720,
    gap: 14,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#6b7280',
    fontWeight: '700'
  },
  endpointText: {
    fontSize: 14,
    color: '#111827'
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 12,
    color: '#374151',
    backgroundColor: '#e5e7eb',
    fontWeight: '700'
  },
  statusHealthy: {
    backgroundColor: '#d1fae5',
    color: '#065f46'
  },
  statusUnhealthy: {
    backgroundColor: '#fee2e2',
    color: '#991b1b'
  },
  statusLoading: {
    backgroundColor: '#fef3c7',
    color: '#92400e'
  },
  healthMessage: {
    fontSize: 14,
    color: '#1f2937'
  },
  healthButton: {
    backgroundColor: '#0f766e',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignSelf: 'flex-start'
  },
  healthButtonText: {
    color: '#ecfeff',
    fontWeight: '700'
  }
});
