// Phone wrapper — holds state for one device, renders status bar + screen + tab bar

const TABS = [
  { key: 'dashboard', label: 'Home',     icon: IconHome },
  { key: 'workouts',  label: 'Workouts', icon: IconDumbbell },
  { key: 'progress',  label: 'Progress', icon: IconChart },
  { key: 'health',    label: 'Health',   icon: IconHeart },
  { key: 'profile',   label: 'Profile',  icon: IconUser },
];

const TAB_KEYS = TABS.map(t => t.key);

function defaultState() {
  return {
    saved: [],
    detailId: null,
    register: { name: '', email: '', password: '', goal: 'strength', success: false },
    health: { status: 'IDLE', endpoint: 'https://api.workout.app/v1/health', latency: null, lastChecked: null },
  };
}

function Phone({ tokens, initialScreen = 'splash', initialState, label, scale = 1, height = 800 }) {
  const t = tokens;
  const [screen, setScreen] = React.useState(initialScreen);
  const [state, setState] = React.useState(() => {
    const base = defaultState();
    if (initialState) return { ...base, ...initialState, register: { ...base.register, ...(initialState.register || {}) } };
    return base;
  });

  const nav = (next, params) => {
    if (params?.id) setState(s => ({ ...s, detailId: params.id }));
    setScreen(next);
  };

  // shared
  const props = { t, nav, state, setState };
  const isTabScreen = TAB_KEYS.includes(screen);

  const renderScreen = () => {
    switch (screen) {
      case 'splash':         return <SplashScreen {...props}/>;
      case 'onboarding':     return <OnboardingScreen {...props}/>;
      case 'register':       return <RegisterScreen {...props}/>;
      case 'dashboard':      return <DashboardScreen {...props}/>;
      case 'workouts':       return <WorkoutsScreen {...props}/>;
      case 'progress':       return <ProgressScreen {...props}/>;
      case 'health':         return <HealthScreen {...props}/>;
      case 'profile':        return <ProfileScreen {...props}/>;
      case 'workoutDetail':  return <WorkoutDetailScreen {...props}/>;
      case 'workoutActive':  return <ActiveWorkout {...props}/>;
      default:               return <SplashScreen {...props}/>;
    }
  };

  const W = 360, H = height;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <div style={{
        width: W, height: H,
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top center',
      }}>
        <div style={{
          width: W, height: H, borderRadius: 44,
          background: t.bg,
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 30px 60px -20px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.05), inset 0 0 0 1.5px rgba(255,255,255,0.4)',
          border: '6px solid #1a1a1a',
          boxSizing: 'border-box',
          fontFamily: t.fontBody,
          color: t.text,
        }}>
          <DeviceStatusBar t={t}/>
          {/* dynamic island */}
          <div style={{
            position: 'absolute', top: 9, left: '50%', transform: 'translateX(-50%)',
            width: 110, height: 32, borderRadius: 999, background: '#0d0d0d', zIndex: 30,
          }}/>

          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
            {renderScreen()}
            {isTabScreen && <TabBar t={t} active={screen} onSelect={k => setScreen(k)}/>}
          </div>

          {/* home indicator */}
          <div style={{
            position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
            width: 120, height: 4, borderRadius: 999, background: t.isDark ? 'rgba(255,255,255,0.45)' : 'rgba(20,24,28,0.35)',
            zIndex: 40,
          }}/>
        </div>
      </div>
      {label && (
        <div style={{
          fontFamily: t.fontMono, fontSize: 11, color: '#7d8088',
          fontWeight: 500, letterSpacing: 0.06, textTransform: 'uppercase',
        }}>{label}</div>
      )}
    </div>
  );
}

function DeviceStatusBar({ t }) {
  const c = t.isDark ? '#fff' : '#15181C';
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 48,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 26px 0', zIndex: 25, pointerEvents: 'none',
    }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: c, fontFamily: '-apple-system, system-ui', letterSpacing: -0.1 }}>9:41</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: c }}>
        {/* signal */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill={c}>
          <rect x="0" y="7" width="3" height="4" rx="0.6"/>
          <rect x="4.5" y="5" width="3" height="6" rx="0.6"/>
          <rect x="9" y="2.5" width="3" height="8.5" rx="0.6"/>
          <rect x="13.5" y="0" width="3" height="11" rx="0.6"/>
        </svg>
        {/* wifi */}
        <svg width="15" height="11" viewBox="0 0 15 11" fill={c}>
          <path d="M7.5 2.5C9.6 2.5 11.5 3.3 13 4.6L14 3.6C12.3 2 10 1 7.5 1S2.7 2 1 3.6L2 4.6C3.5 3.3 5.4 2.5 7.5 2.5Z"/>
          <path d="M7.5 5.5C8.8 5.5 9.9 6 10.8 6.8L11.8 5.8C10.6 4.7 9.1 4 7.5 4S4.4 4.7 3.2 5.8L4.2 6.8C5.1 6 6.2 5.5 7.5 5.5Z"/>
          <circle cx="7.5" cy="9.2" r="1.4"/>
        </svg>
        {/* battery */}
        <svg width="24" height="11" viewBox="0 0 24 11" fill="none">
          <rect x="0.5" y="0.5" width="21" height="10" rx="3" stroke={c} strokeOpacity="0.4"/>
          <rect x="2" y="2" width="18" height="7" rx="1.5" fill={c}/>
          <rect x="22" y="3.5" width="1.5" height="4" rx="0.5" fill={c} opacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

function TabBar({ t, active, onSelect }) {
  return (
    <div style={{
      position: 'absolute', left: 12, right: 12, bottom: 22,
      background: t.isDark ? 'rgba(20,24,28,0.85)' : 'rgba(255,255,255,0.88)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      border: `1px solid ${t.border}`,
      borderRadius: 28,
      padding: '8px 6px',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      boxShadow: '0 8px 24px -8px rgba(0,0,0,0.15)',
      zIndex: 20,
    }}>
      {TABS.map(tab => {
        const Ic = tab.icon;
        const isActive = active === tab.key;
        return (
          <button key={tab.key} onClick={() => onSelect(tab.key)} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            padding: '6px 10px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            color: isActive ? t.accentDeep : t.textSoft,
            transition: 'color 0.15s',
            minWidth: 48,
          }}>
            <Ic size={22} strokeWidth={isActive ? 2.2 : 1.7}/>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.02 }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// Minimal active workout screen (in-session)
function ActiveWorkout({ t, nav, state }) {
  const w = WA_WORKOUTS.find(x => x.id === state.detailId) || WA_WORKOUTS[0];
  const [elapsed, setElapsed] = React.useState(0);
  const [running, setRunning] = React.useState(true);
  const [exIdx, setExIdx] = React.useState(0);
  React.useEffect(() => {
    if (!running) return;
    const i = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(i);
  }, [running]);
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');
  const ex = w.exercises[exIdx];
  const pct = ((exIdx + 1) / w.exercises.length) * 100;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: t.surface, padding: '56px 22px 26px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26 }}>
        <button onClick={() => nav('workoutDetail', { id: w.id })} style={iconBtn(t)}><IconChevronLeft size={18}/></button>
        <span style={{ fontSize: 11.5, color: t.textSoft, fontFamily: t.fontMono, letterSpacing: 0.06 }}>SET {exIdx + 1} / {w.exercises.length}</span>
        <button style={iconBtn(t)}><IconSettings size={18}/></button>
      </div>
      <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 11.5, color: t.textSoft, fontWeight: 600, letterSpacing: 0.06, textTransform: 'uppercase' }}>Current exercise</span>
        <div style={{ fontFamily: t.fontDisplay, fontSize: 30, fontWeight: 600, color: t.text, letterSpacing: -0.9, lineHeight: 1.1, maxWidth: 260 }}>{ex.name}</div>
        <div style={{ fontFamily: t.fontMono, fontSize: 13, color: t.textMuted, letterSpacing: 0.1 }}>{ex.sets} · rest {ex.rest}</div>
        <div style={{
          width: 200, height: 200, borderRadius: 999,
          background: t.bg, border: `1px solid ${t.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: t.fontDisplay, fontSize: 48, fontWeight: 600, color: t.text, letterSpacing: -2,
          marginTop: 8,
        }}>{mm}:{ss}</div>
      </div>
      <div style={{ height: 6, borderRadius: 999, background: t.bgDeep, marginBottom: 14, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: t.accent, borderRadius: 999, transition: 'width 0.3s' }}/>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <SecondaryButton t={t} onClick={() => setRunning(r => !r)}>{running ? 'Pause' : 'Resume'}</SecondaryButton>
        <PrimaryButton t={t} onClick={() => {
          if (exIdx < w.exercises.length - 1) setExIdx(i => i + 1);
          else nav('dashboard');
        }} trailingIcon={<IconArrowRight size={16}/>}>{exIdx < w.exercises.length - 1 ? 'Next' : 'Finish'}</PrimaryButton>
      </div>
    </div>
  );
}

Object.assign(window, { Phone, TabBar, TABS, defaultState, ActiveWorkout });
