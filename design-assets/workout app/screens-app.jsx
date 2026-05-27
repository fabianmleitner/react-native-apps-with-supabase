// Progress + Health + Profile + Workouts list screens

function ProgressScreen({ t, nav, state }) {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const minutes = [38, 0, 52, 22, 45, 0, 27];
  const max = Math.max(...minutes, 60);
  const todayIdx = 4;

  const stats = [
    { label: 'Workouts',      value: '14',  unit: '', sub: 'this month',  icon: <IconDumbbell size={14}/>, accent: t.accent },
    { label: 'Total minutes', value: '486', unit: '', sub: '+12% vs last',icon: <IconClock size={14}/>,    accent: 'oklch(68% 0.14 280)' },
    { label: 'Current streak',value: '12',  unit: 'd', sub: 'best: 24 d', icon: <IconFlame size={14}/>,    accent: 'oklch(64% 0.16 45)' },
    { label: 'Avg difficulty',value: 'Mod', unit: '',  sub: 'RPE 6.4',    icon: <IconBolt size={14}/>,     accent: 'oklch(76% 0.13 70)' },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: t.bg, overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '60px 20px 100px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <div>
            <div style={{ fontFamily: t.fontDisplay, fontSize: 24, fontWeight: 600, color: t.text, letterSpacing: -0.6 }}>Progress</div>
            <div style={{ fontSize: 13.5, color: t.textMuted, marginTop: 4 }}>Week of May 11</div>
          </div>
          <button style={iconBtn(t)}><IconSettings size={18}/></button>
        </div>

        {/* Weekly chart */}
        <div style={{
          background: t.surface, borderRadius: t.radiusLg,
          border: `1px solid ${t.border}`, padding: 18,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 11.5, color: t.textSoft, fontWeight: 600, letterSpacing: 0.04, textTransform: 'uppercase' }}>Active minutes</span>
            <span style={{ fontFamily: t.fontMono, fontSize: 11, color: t.textMuted }}>184 / 240 min</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120, marginBottom: 8 }}>
            {minutes.map((m, i) => {
              const h = m === 0 ? 6 : Math.max(8, (m / max) * 110);
              const isToday = i === todayIdx;
              const isRest  = m === 0;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: t.fontMono, fontSize: 10, color: m ? t.textMuted : 'transparent', fontWeight: 500 }}>{m || '·'}</span>
                  <div style={{
                    width: '100%', height: h, borderRadius: 8,
                    background: isRest ? t.bgDeep : isToday ? t.accent : `color-mix(in srgb, ${t.accent} 28%, transparent)`,
                    border: isToday ? `1px solid color-mix(in srgb, ${t.accent} 70%, transparent)` : 'none',
                  }}/>
                  <span style={{ fontSize: 10.5, fontWeight: 600, color: isToday ? t.text : t.textSoft, letterSpacing: 0.04 }}>{days[i]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginTop: 16 }}>
          {stats.map(s => (
            <ProgressStatCard key={s.label} t={t}
              label={s.label} value={s.value} unit={s.unit} sublabel={s.sub}
              accent={s.accent} icon={s.icon}/>
          ))}
        </div>

        {/* Recent sessions */}
        <div style={{ marginTop: 22 }}>
          <SectionHeader t={t} title="Recent sessions" action={{ label: 'History' }}/>
          <div style={{
            background: t.surface, borderRadius: t.radius,
            border: `1px solid ${t.border}`, overflow: 'hidden',
          }}>
            {WA_RECENT.map((r, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 14px',
                borderBottom: i < WA_RECENT.length - 1 ? `1px solid ${t.border}` : 'none',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: t.bgDeep, color: t.textMuted,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: t.fontMono, fontSize: 10.5, fontWeight: 600, lineHeight: 1.1, textAlign: 'center',
                }}>{r.date.split(' ')[0].slice(0,3)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: t.textSoft, marginTop: 2 }}>{r.date} · {r.duration} min</div>
                </div>
                <DifficultyBadge level={r.level} t={t} size="sm"/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Health / Connection check
// ─────────────────────────────────────────────────────────────
function HealthScreen({ t, nav, state, setState }) {
  const status = state.health.status;
  const endpoint = state.health.endpoint;
  const lastChecked = state.health.lastChecked;
  const latency = state.health.latency;

  const setEndpoint = (v) => setState(s => ({ ...s, health: { ...s.health, endpoint: v } }));

  const runCheck = () => {
    setState(s => ({ ...s, health: { ...s.health, status: 'LOADING' } }));
    setTimeout(() => {
      const ok = Math.random() > 0.18;
      setState(s => ({ ...s, health: {
        ...s.health,
        status: ok ? 'HEALTHY' : 'UNHEALTHY',
        latency: ok ? 80 + Math.floor(Math.random() * 220) : null,
        lastChecked: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      }}));
    }, 1200);
  };

  const checks = [
    { label: 'Auth /v1/user',     status: status === 'HEALTHY' ? 'ok' : status === 'UNHEALTHY' ? 'fail' : status === 'LOADING' ? 'pending' : 'idle' },
    { label: 'Postgres pool',     status: status === 'HEALTHY' ? 'ok' : status === 'UNHEALTHY' ? 'ok'   : status === 'LOADING' ? 'pending' : 'idle' },
    { label: 'Edge function: log',status: status === 'HEALTHY' ? 'ok' : status === 'UNHEALTHY' ? 'fail' : status === 'LOADING' ? 'pending' : 'idle' },
    { label: 'Realtime channel',  status: status === 'HEALTHY' ? 'ok' : status === 'UNHEALTHY' ? 'pending' : status === 'LOADING' ? 'pending' : 'idle' },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: t.bg, overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '60px 20px 100px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div>
            <div style={{ fontFamily: t.fontDisplay, fontSize: 24, fontWeight: 600, color: t.text, letterSpacing: -0.6 }}>Health</div>
            <div style={{ fontSize: 13.5, color: t.textMuted, marginTop: 4 }}>Verify Supabase connectivity</div>
          </div>
          <HealthStatusPill status={status} t={t}/>
        </div>

        {/* Endpoint card */}
        <div style={{
          background: t.surface, borderRadius: t.radius,
          border: `1px solid ${t.border}`,
          padding: 14, marginTop: 22,
        }}>
          <div style={{ fontSize: 11.5, color: t.textSoft, fontWeight: 600, letterSpacing: 0.04, textTransform: 'uppercase', marginBottom: 8 }}>Endpoint</div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: t.bgDeep, borderRadius: 12,
            padding: '10px 12px',
          }}>
            <span style={{ fontFamily: t.fontMono, fontSize: 11, color: t.accentDeep, fontWeight: 600 }}>GET</span>
            <input value={endpoint} onChange={e => setEndpoint(e.target.value)} style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontFamily: t.fontMono, fontSize: 12, color: t.text, letterSpacing: -0.1,
            }}/>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 11.5, color: t.textSoft, fontFamily: t.fontMono }}>
            <span>last: {lastChecked || '—'}</span>
            <span>latency: {latency != null ? `${latency} ms` : '—'}</span>
          </div>
        </div>

        {/* Health Check button */}
        <div style={{ marginTop: 14 }}>
          <PrimaryButton t={t} onClick={runCheck} disabled={status === 'LOADING'}
            leadingIcon={status === 'LOADING' ? <span style={{ width: 14, height: 14, borderRadius: 999, border: `2px solid ${t.accentInk}`, borderTopColor: 'transparent', animation: 'wa-spin 0.8s linear infinite' }}/> : <IconRefresh size={16}/>}>
            {status === 'LOADING' ? 'Running…' : 'Run Health Check'}
          </PrimaryButton>
        </div>

        {/* Status pill matrix */}
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 11.5, color: t.textSoft, fontWeight: 600, letterSpacing: 0.04, textTransform: 'uppercase', marginBottom: 10 }}>Pill states</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {['IDLE','LOADING','HEALTHY','UNHEALTHY'].map(s => (
              <HealthStatusPill key={s} status={s} t={t}/>
            ))}
          </div>
        </div>

        {/* Subsystem table */}
        <div style={{ marginTop: 22 }}>
          <div style={{ fontSize: 11.5, color: t.textSoft, fontWeight: 600, letterSpacing: 0.04, textTransform: 'uppercase', marginBottom: 10 }}>Subsystems</div>
          <div style={{
            background: t.surface, borderRadius: t.radius,
            border: `1px solid ${t.border}`, overflow: 'hidden',
          }}>
            {checks.map((c, i) => (
              <div key={c.label} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '13px 14px',
                borderBottom: i < checks.length - 1 ? `1px solid ${t.border}` : 'none',
              }}>
                <CheckDot kind={c.status} t={t}/>
                <span style={{ fontSize: 13.5, color: t.text, flex: 1, fontFamily: t.fontMono }}>{c.label}</span>
                <span style={{
                  fontFamily: t.fontMono, fontSize: 10.5, fontWeight: 600, letterSpacing: 0.06,
                  color: c.status === 'ok' ? t.diffBeginner.fg : c.status === 'fail' ? t.diffAdvanced.fg : c.status === 'pending' ? t.diffIntermediate.fg : t.textSoft,
                  textTransform: 'uppercase',
                }}>{c.status === 'ok' ? '200 OK' : c.status === 'fail' ? '503' : c.status === 'pending' ? '...' : '—'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckDot({ kind, t }) {
  const map = {
    ok:      t.diffBeginner.fg,
    fail:    t.diffAdvanced.fg,
    pending: t.diffIntermediate.fg,
    idle:    t.textSoft,
  };
  const c = map[kind];
  return (
    <div style={{
      width: 18, height: 18, borderRadius: 999,
      background: `color-mix(in srgb, ${c} 18%, transparent)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {kind === 'ok' ? (
        <IconCheck size={11} strokeWidth={2.6} stroke={c}/>
      ) : kind === 'pending' ? (
        <span style={{ width: 7, height: 7, borderRadius: 999, border: `1.5px solid ${c}`, borderTopColor: 'transparent', animation: 'wa-spin 0.8s linear infinite' }}/>
      ) : kind === 'fail' ? (
        <span style={{ fontSize: 11, color: c, fontWeight: 700, lineHeight: 1 }}>×</span>
      ) : (
        <span style={{ width: 6, height: 6, borderRadius: 999, background: c }}/>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Workouts list (Workouts tab)
// ─────────────────────────────────────────────────────────────
function WorkoutsScreen({ t, nav, state }) {
  const [filter, setFilter] = React.useState('All');
  const filters = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const list = filter === 'All' ? WA_WORKOUTS : WA_WORKOUTS.filter(w => w.level === filter);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: t.bg, overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '60px 20px 100px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <div style={{ fontFamily: t.fontDisplay, fontSize: 24, fontWeight: 600, color: t.text, letterSpacing: -0.6 }}>Workouts</div>
            <div style={{ fontSize: 13.5, color: t.textMuted, marginTop: 4 }}>Curated for your goal: build strength</div>
          </div>
          <button style={iconBtn(t)}><IconSearch size={18}/></button>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 14px', borderRadius: 999, flexShrink: 0,
              border: `1px solid ${filter === f ? t.accent : t.border}`,
              background: filter === f ? t.accent : t.surface,
              color: filter === f ? t.accentInk : t.text,
              fontSize: 13, fontWeight: 500, cursor: 'pointer',
            }}>{f}</button>
          ))}
        </div>
        {list.length === 0 ? (
          <EmptyState t={t} title="No workouts match" body="Try a different filter — we add new sessions every Monday." icon={<IconSearch size={22}/>}/>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {list.map(w => (
              <WorkoutCard key={w.id} workout={w} t={t} onClick={() => nav('workoutDetail', { id: w.id })}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Profile tab — simple
// ─────────────────────────────────────────────────────────────
function ProfileScreen({ t, nav, state }) {
  const rows = [
    { label: 'Training goal',  value: 'Build strength', icon: <IconTarget size={18}/> },
    { label: 'Weekly target',  value: '5 sessions',     icon: <IconCheck size={18}/> },
    { label: 'Reminder time',  value: '07:30',          icon: <IconClock size={18}/> },
    { label: 'Units',          value: 'Metric · kg',    icon: <IconBolt size={18}/> },
  ];
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: t.bg, overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '60px 20px 100px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 999,
            background: `linear-gradient(135deg, ${t.accent}, color-mix(in srgb, ${t.accent} 55%, black))`,
            color: t.accentInk, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: t.fontDisplay, fontSize: 22, fontWeight: 600,
          }}>FH</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: t.fontDisplay, fontSize: 20, fontWeight: 600, color: t.text, letterSpacing: -0.4 }}>Fabian Hartmann</div>
            <div style={{ fontSize: 13, color: t.textMuted, marginTop: 2 }}>fabian@workout.app · Pro</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 22 }}>
          {[
            { label: 'Sessions', value: '146' },
            { label: 'Hours',    value: '92' },
            { label: 'Streak',   value: '12 d' },
          ].map(s => (
            <div key={s.label} style={{
              background: t.surface, borderRadius: t.radius, border: `1px solid ${t.border}`,
              padding: 12, textAlign: 'center',
            }}>
              <div style={{ fontFamily: t.fontDisplay, fontSize: 20, fontWeight: 600, color: t.text, letterSpacing: -0.4 }}>{s.value}</div>
              <div style={{ fontSize: 11.5, color: t.textSoft, fontWeight: 600, letterSpacing: 0.04, textTransform: 'uppercase', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11.5, color: t.textSoft, fontWeight: 600, letterSpacing: 0.04, textTransform: 'uppercase', marginBottom: 10 }}>Preferences</div>
        <div style={{
          background: t.surface, borderRadius: t.radius,
          border: `1px solid ${t.border}`, overflow: 'hidden',
        }}>
          {rows.map((r, i) => (
            <div key={r.label} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 14px',
              borderBottom: i < rows.length - 1 ? `1px solid ${t.border}` : 'none',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: t.accentSoft, color: t.accentDeep,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{r.icon}</div>
              <span style={{ flex: 1, fontSize: 14, color: t.text, fontWeight: 500 }}>{r.label}</span>
              <span style={{ fontSize: 13, color: t.textMuted }}>{r.value}</span>
              <IconChevronRight size={14} stroke={t.textSoft}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ProgressScreen, HealthScreen, WorkoutsScreen, ProfileScreen, CheckDot });
