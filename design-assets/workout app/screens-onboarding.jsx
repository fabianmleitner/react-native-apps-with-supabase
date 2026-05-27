// Screens for the Workout App prototype
// Each screen receives { t, nav, state } where:
//   t      = design tokens
//   nav    = (screenKey, params?) => void
//   state  = shared app state (current tab, savedWorkouts, healthStatus, registerForm, etc.)
//   setState = setter for shared state

// ---------- sample data ----------
const WORKOUTS = [
  { id: 'lbs',  title: 'Lower Body Strength',   duration: 45, level: 'Intermediate', focus: 'Lower Body', kcal: 380,
    summary: 'Build strength and stability through compound lower-body movements. Focused tempo work for posterior chain and hip drive.',
    equipment: ['Barbell', 'Dumbbells', 'Bench'],
    notes: 'Warm up thoroughly with 5 min of hip mobility. Aim for RPE 7 across working sets, not failure. Re-rack and rest the full 90s.',
    exercises: [
      { name: 'Back Squat', sets: '4 × 6', rest: '90s', tag: 'Compound' },
      { name: 'Romanian Deadlift', sets: '3 × 8', rest: '90s', tag: 'Posterior' },
      { name: 'Walking Lunge', sets: '3 × 12', rest: '60s', tag: 'Unilateral' },
      { name: 'Hip Thrust', sets: '3 × 10', rest: '60s', tag: 'Glutes' },
      { name: 'Calf Raise', sets: '3 × 15', rest: '45s', tag: 'Accessory' },
    ],
  },
  { id: 'csc', title: 'Core Stability Circuit', duration: 20, level: 'Beginner', focus: 'Core', kcal: 160,
    summary: 'Anti-rotation, anti-extension, and bracing patterns. Designed to bulletproof your trunk for heavier work.',
    equipment: ['Mat', 'Resistance Band'],
    notes: 'Slow and controlled — quality of bracing beats reps. Breathe behind your ribs, not into your belly.',
    exercises: [
      { name: 'Dead Bug', sets: '3 × 10', rest: '30s', tag: 'Anti-extension' },
      { name: 'Pallof Press', sets: '3 × 12', rest: '30s', tag: 'Anti-rotation' },
      { name: 'Side Plank', sets: '3 × 30s', rest: '30s', tag: 'Lateral' },
      { name: 'Bird Dog', sets: '3 × 10', rest: '30s', tag: 'Pattern' },
    ],
  },
  { id: 'ac', title: 'Athlete Conditioning', duration: 60, level: 'Advanced', focus: 'Athletic', kcal: 620,
    summary: 'High-output sprint and plyometric protocol. Designed for athletes returning to in-season load.',
    equipment: ['Sled', 'Box', 'Track or Open Space'],
    notes: 'Skip if you haven\'t hit Tier 2 conditioning in 2+ weeks. Drink water between blocks; cooldown is non-negotiable.',
    exercises: [
      { name: 'Box Jump', sets: '5 × 4', rest: '120s', tag: 'Power' },
      { name: 'Sprint 40m', sets: '6 × 1', rest: '90s', tag: 'Speed' },
      { name: 'Sled Push', sets: '4 × 20m', rest: '120s', tag: 'Resisted' },
      { name: 'Med Ball Slam', sets: '4 × 8', rest: '60s', tag: 'Power' },
      { name: 'Tempo Row', sets: '3 × 500m', rest: '90s', tag: 'Capacity' },
    ],
  },
];

const RECENT = [
  { date: 'Yesterday', title: 'Upper Body Push',  duration: 42, level: 'Intermediate' },
  { date: '3 days ago', title: 'Mobility Reset',  duration: 18, level: 'Beginner' },
  { date: 'Apr 26',     title: 'Tempo Run',       duration: 35, level: 'Intermediate' },
  { date: 'Apr 24',     title: 'Athlete Conditioning', duration: 58, level: 'Advanced' },
];

const GOALS = [
  { id: 'strength',   label: 'Build strength' },
  { id: 'endurance',  label: 'Endurance' },
  { id: 'lose',       label: 'Lose weight' },
  { id: 'mobility',   label: 'Move better' },
  { id: 'sport',      label: 'Sport-specific' },
];

window.WA_WORKOUTS = WORKOUTS;
window.WA_RECENT   = RECENT;
window.WA_GOALS    = GOALS;

// ─────────────────────────────────────────────────────────────
// Splash screen
// ─────────────────────────────────────────────────────────────
function SplashScreen({ t, nav }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: t.bg, position: 'relative', overflow: 'hidden',
    }}>
      {/* warm radial */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at 50% 38%, ${t.accentSoft} 0%, transparent 55%)`,
        opacity: 0.7, pointerEvents: 'none',
      }}/>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 96, height: 96, borderRadius: 28,
          background: t.surface,
          border: `1px solid ${t.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 18px 40px -16px rgba(0,0,0,0.15)',
        }}>
          <IconLogo size={56} color={t.accentDeep}/>
        </div>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <div style={{
            fontFamily: t.fontDisplay, fontSize: 30, fontWeight: 600,
            color: t.text, letterSpacing: -0.8,
          }}>Workout App</div>
          <div style={{
            fontFamily: t.fontBody, fontSize: 14, color: t.textMuted,
            marginTop: 6, letterSpacing: 0.4, fontWeight: 500,
          }}>Plan. Train. Progress.</div>
        </div>
      </div>
      <div style={{
        position: 'absolute', bottom: 56, left: 0, right: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 999,
          border: `2px solid ${t.borderStrong}`, borderTopColor: t.accent,
          animation: 'wa-spin 0.9s linear infinite',
        }}/>
        <span style={{ fontSize: 11, color: t.textSoft, fontFamily: t.fontMono, letterSpacing: 0.1 }}>v1.0.0 · WARMING UP</span>
      </div>
      {/* tap-to-advance for the live prototype */}
      <button onClick={() => nav('onboarding')} style={{
        position: 'absolute', inset: 0, background: 'transparent', border: 'none', cursor: 'pointer',
      }} aria-label="Continue" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Onboarding screen
// ─────────────────────────────────────────────────────────────
function OnboardingScreen({ t, nav }) {
  const benefits = [
    { icon: <IconTarget size={20} />, title: 'Personalized plans', body: 'Workouts tuned to your goals, schedule, and current fitness level.' },
    { icon: <IconClock size={20} />,  title: 'Track every session', body: 'Duration, difficulty, and effort — captured automatically.' },
    { icon: <IconFlame size={20} />,  title: 'Stay consistent',     body: 'Weekly progress, streaks, and small wins that compound.' },
  ];
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: t.bg, padding: '60px 24px 30px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <IconLogo size={26} color={t.accentDeep} />
        <span onClick={() => nav('dashboard')} style={{ fontSize: 13, color: t.textMuted, cursor: 'pointer', fontWeight: 500 }}>Skip</span>
      </div>
      <div style={{ marginBottom: 28 }}>
        <div style={{
          fontFamily: t.fontDisplay, fontSize: 34, fontWeight: 600,
          color: t.text, letterSpacing: -1.1, lineHeight: 1.05,
        }}>
          Train with<br/>
          <span style={{ fontStyle: 'italic', fontWeight: 500 }}>intention.</span>
        </div>
        <div style={{ fontSize: 15, color: t.textMuted, marginTop: 12, lineHeight: 1.5, maxWidth: 300 }}>
          Workout App helps you plan sessions, log results, and watch your weekly effort add up.
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 'auto' }}>
        {benefits.map((b, i) => (
          <div key={i} style={{
            background: t.surface,
            border: `1px solid ${t.border}`,
            borderRadius: t.radius,
            padding: 16,
            display: 'flex', alignItems: 'flex-start', gap: 14,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12,
              background: t.accentSoft, color: t.accentDeep,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>{b.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: t.text, letterSpacing: -0.2 }}>{b.title}</div>
              <div style={{ fontSize: 13, color: t.textMuted, marginTop: 3, lineHeight: 1.4 }}>{b.body}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
        <PrimaryButton t={t} onClick={() => nav('register')}>Get Started</PrimaryButton>
        <SecondaryButton t={t} ghost onClick={() => nav('dashboard')}>I already have an account</SecondaryButton>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Register screen + success state
// ─────────────────────────────────────────────────────────────
function RegisterScreen({ t, nav, state, setState }) {
  const f = state.register;
  const setField = (k, v) => setState(s => ({ ...s, register: { ...s.register, [k]: v } }));
  const [showPass, setShowPass] = React.useState(false);

  if (state.register.success) {
    return <RegisterSuccess t={t} nav={nav} setState={setState} name={f.name || 'Fabian'} />;
  }

  const handleSubmit = () => {
    if (!f.name || !f.email || !f.password) return;
    setState(s => ({ ...s, register: { ...s.register, success: true } }));
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: t.bg, padding: '56px 24px 32px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <button onClick={() => nav('onboarding')} style={{
          width: 40, height: 40, borderRadius: 12, background: t.surface,
          border: `1px solid ${t.border}`, color: t.text,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}><IconChevronLeft size={18} /></button>
        <span style={{ fontSize: 13, color: t.textMuted, fontWeight: 500 }}>Step 1 of 1</span>
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: t.fontDisplay, fontSize: 30, fontWeight: 600, color: t.text, letterSpacing: -0.9, lineHeight: 1.1 }}>Create your account</div>
        <div style={{ fontSize: 14, color: t.textMuted, marginTop: 8 }}>Start your training journey in under a minute.</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Field t={t} label="Full name"     value={f.name}     onChange={v => setField('name', v)}     placeholder="Fabian Hartmann"/>
        <Field t={t} label="Email"         value={f.email}    onChange={v => setField('email', v)}    placeholder="fabian@workout.app" type="email"/>
        <Field t={t} label="Password"      value={f.password} onChange={v => setField('password', v)} placeholder="At least 8 characters"
          type={showPass ? 'text' : 'password'}
          trailing={
            <button onClick={() => setShowPass(s => !s)} style={{ background: 'transparent', border: 'none', color: t.textMuted, cursor: 'pointer', padding: 4 }}>
              {showPass ? <IconEyeOff size={18}/> : <IconEye size={18}/>}
            </button>
          }
        />
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: t.textMuted, letterSpacing: 0.02 }}>Training goal</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {WA_GOALS.map(g => {
              const sel = f.goal === g.id;
              return (
                <button key={g.id} onClick={() => setField('goal', g.id)} style={{
                  padding: '9px 14px',
                  borderRadius: 999,
                  border: `1px solid ${sel ? t.accent : t.border}`,
                  background: sel ? t.accent : t.surface,
                  color: sel ? t.accentInk : t.text,
                  fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  fontFamily: t.fontBody, letterSpacing: -0.1,
                  transition: 'all 0.15s',
                }}>{g.label}</button>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 28 }}>
        <PrimaryButton t={t} onClick={handleSubmit} disabled={!(f.name && f.email && f.password)}>Create Account</PrimaryButton>
        <div style={{ textAlign: 'center', fontSize: 13, color: t.textMuted }}>
          Already a member?{' '}
          <span onClick={() => nav('dashboard')} style={{ color: t.accentDeep, fontWeight: 600, cursor: 'pointer' }}>Sign in</span>
        </div>
      </div>
    </div>
  );
}

function RegisterSuccess({ t, nav, setState, name }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: t.bg, padding: '60px 24px 32px', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at 50% 35%, ${t.accentSoft} 0%, transparent 60%)`,
        pointerEvents: 'none',
      }}/>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
        <div style={{
          width: 88, height: 88, borderRadius: 999,
          background: t.accent, color: t.accentInk,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 18px 40px -10px color-mix(in srgb, ${t.accent} 60%, transparent)`,
        }}>
          <IconCheck size={42} strokeWidth={2.4} />
        </div>
        <div>
          <div style={{ fontFamily: t.fontDisplay, fontSize: 28, fontWeight: 600, color: t.text, letterSpacing: -0.8 }}>
            You're ready to train
          </div>
          <div style={{ fontSize: 14, color: t.textMuted, marginTop: 8, maxWidth: 280, lineHeight: 1.45 }}>
            Welcome aboard, {name.split(' ')[0]}. We've drafted your first week — let's open the dashboard.
          </div>
        </div>
      </div>
      <div style={{ position: 'relative', width: '100%', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <PrimaryButton t={t} onClick={() => {
          setState(s => ({ ...s, register: { ...s.register, success: false } }));
          nav('dashboard');
        }} trailingIcon={<IconArrowRight size={18} />}>Go to Dashboard</PrimaryButton>
      </div>
    </div>
  );
}

Object.assign(window, { SplashScreen, OnboardingScreen, RegisterScreen, RegisterSuccess });
