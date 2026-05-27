// Dashboard + Workout Detail screens

function DashboardScreen({ t, nav, state, setState }) {
  const upcoming = WA_WORKOUTS;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: t.bg, overflow: 'hidden' }}>
      <div style={{
        flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch',
        padding: '60px 20px 100px',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <div style={{ fontFamily: t.fontDisplay, fontSize: 24, fontWeight: 600, color: t.text, letterSpacing: -0.6, lineHeight: 1.1 }}>
              Good morning, Fabian
            </div>
            <div style={{ fontSize: 13.5, color: t.textMuted, marginTop: 4 }}>Ready for your next session?</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={iconBtn(t)}><IconBell size={18}/></button>
            <button style={iconBtn(t)}><IconUser size={18}/></button>
          </div>
        </div>

        {/* Hero progress panel */}
        <HeroProgress t={t} state={state} />

        {/* Upcoming Workouts */}
        <div style={{ marginTop: 26 }}>
          <SectionHeader t={t} title="Upcoming Workouts" action={{ label: 'See all', onClick: () => nav('workouts') }}/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {upcoming.map(w => (
              <WorkoutCard key={w.id} workout={w} t={t} onClick={() => nav('workoutDetail', { id: w.id })}/>
            ))}
          </div>
        </div>

        {/* Quick focus row */}
        <div style={{ marginTop: 26 }}>
          <SectionHeader t={t} title="Quick focus" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {[
              { label: 'Recovery',  body: '12 min', tone: 'oklch(76% 0.09 150)', icon: <IconHeart size={18}/> },
              { label: 'Mobility',  body: '15 min', tone: 'oklch(74% 0.11 200)', icon: <IconBolt size={18}/> },
            ].map(q => (
              <div key={q.label} style={{
                background: t.surface, borderRadius: t.radius,
                border: `1px solid ${t.border}`,
                padding: 14, display: 'flex', flexDirection: 'column', gap: 12,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `color-mix(in srgb, ${q.tone} 20%, transparent)`,
                  color: q.tone, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{q.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{q.label}</div>
                  <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>{q.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function iconBtn(t) {
  return {
    width: 38, height: 38, borderRadius: 999,
    background: t.surface,
    border: `1px solid ${t.border}`,
    color: t.text, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };
}

function HeroProgress({ t, state }) {
  const completed = 3;
  const goal = 5;
  const pct = Math.round((completed / goal) * 100);
  return (
    <div style={{
      background: t.surface,
      borderRadius: t.radiusLg,
      border: `1px solid ${t.border}`,
      padding: 18,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: 999,
        background: `radial-gradient(circle, ${t.accentSoft} 0%, transparent 70%)`, pointerEvents: 'none',
      }}/>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: t.textSoft, letterSpacing: 0.04, textTransform: 'uppercase' }}>This week</div>
          <div style={{ fontFamily: t.fontDisplay, fontSize: 30, fontWeight: 600, color: t.text, letterSpacing: -1, lineHeight: 1, marginTop: 4 }}>
            {completed}<span style={{ color: t.textSoft, fontWeight: 500 }}>/{goal}</span>
          </div>
          <div style={{ fontSize: 13, color: t.textMuted, marginTop: 4 }}>sessions complete</div>
        </div>
        <ProgressRing pct={pct} t={t} size={72}/>
      </div>
      <div style={{ position: 'relative', height: 1, background: t.border, margin: '4px 0 14px' }}/>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
        <HeroStat t={t} label="Streak" value="12" unit="days" icon={<IconFlame size={14}/>} tone="oklch(64% 0.16 45)"/>
        <HeroStat t={t} label="Volume" value="184" unit="min" icon={<IconClock size={14}/>}/>
        <HeroStat t={t} label="Effort" value="Mod" icon={<IconBolt size={14}/>}/>
      </div>
    </div>
  );
}

function HeroStat({ label, value, unit, icon, tone, t }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: t.textSoft, fontWeight: 600, letterSpacing: 0.04, textTransform: 'uppercase' }}>
        <span style={{ color: tone || t.accentDeep }}>{icon}</span> {label}
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 3 }}>
        <span style={{ fontFamily: t.fontDisplay, fontSize: 20, fontWeight: 600, color: t.text, letterSpacing: -0.4, lineHeight: 1 }}>{value}</span>
        {unit && <span style={{ fontSize: 11, color: t.textMuted }}>{unit}</span>}
      </span>
    </div>
  );
}

function ProgressRing({ pct, t, size = 72, stroke = 7 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * (pct / 100);
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={t.bgDeep} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={t.accent} strokeWidth={stroke}
          strokeDasharray={`${dash} ${c}`} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}/>
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: t.fontDisplay, fontSize: 14, fontWeight: 600, color: t.text, letterSpacing: -0.3,
      }}>{pct}%</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Workout Detail
// ─────────────────────────────────────────────────────────────
function WorkoutDetailScreen({ t, nav, state, setState }) {
  const id = state.detailId || 'lbs';
  const w = WA_WORKOUTS.find(x => x.id === id) || WA_WORKOUTS[0];
  const saved = state.saved.includes(w.id);
  const toggleSaved = () => setState(s => ({
    ...s, saved: saved ? s.saved.filter(x => x !== w.id) : [...s.saved, w.id],
  }));

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: t.bg, overflow: 'hidden' }}>
      {/* hero header */}
      <div style={{ position: 'relative', padding: '56px 20px 22px', background: t.surfaceAlt, borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <button onClick={() => nav('dashboard')} style={iconBtn(t)}><IconChevronLeft size={18}/></button>
          <button onClick={toggleSaved} style={{ ...iconBtn(t), color: saved ? t.accent : t.text }}>
            <IconBookmark size={18}/>
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <WorkoutGlyph focus={w.focus} t={t} size={56}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 11, color: t.textSoft, fontWeight: 600, letterSpacing: 0.04, textTransform: 'uppercase' }}>{w.focus}</span>
            <div style={{ fontFamily: t.fontDisplay, fontSize: 22, fontWeight: 600, color: t.text, letterSpacing: -0.6, lineHeight: 1.15, marginTop: 2 }}>
              {w.title}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14 }}>
          <Chip t={t} icon={<IconClock size={13}/>}>{w.duration} min</Chip>
          <DifficultyBadge level={w.level} t={t}/>
          <Chip t={t} icon={<IconFlame size={13}/>}>{w.kcal} kcal</Chip>
        </div>
      </div>

      {/* scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '18px 20px 130px' }}>
        <SectionBlock t={t} title="Overview">
          <p style={{ fontSize: 14, color: t.textMuted, lineHeight: 1.55, margin: 0 }}>{w.summary}</p>
        </SectionBlock>

        <SectionBlock t={t} title="Exercises" suffix={<span style={{ fontSize: 12, color: t.textSoft, fontWeight: 500 }}>{w.exercises.length} moves</span>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {w.exercises.map((ex, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 0',
                borderBottom: i < w.exercises.length - 1 ? `1px solid ${t.border}` : 'none',
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: t.bgDeep, color: t.textMuted,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: t.fontMono, fontSize: 11.5, fontWeight: 600,
                }}>{String(i+1).padStart(2,'0')}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{ex.name}</div>
                  <div style={{ fontSize: 11.5, color: t.textSoft, marginTop: 2, letterSpacing: 0.02 }}>{ex.tag} · rest {ex.rest}</div>
                </div>
                <span style={{ fontFamily: t.fontMono, fontSize: 13, color: t.text, fontWeight: 500 }}>{ex.sets}</span>
              </div>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock t={t} title="Equipment">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {w.equipment.map(e => (
              <span key={e} style={{
                padding: '6px 11px', borderRadius: 999,
                background: t.bgDeep, color: t.textMuted,
                fontSize: 12, fontWeight: 500,
              }}>{e}</span>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock t={t} title="Trainer notes">
          <div style={{
            background: t.accentSoft, color: t.accentDeep,
            borderRadius: 14, padding: 14,
            fontSize: 13.5, lineHeight: 1.55,
          }}>{w.notes}</div>
        </SectionBlock>
      </div>

      {/* sticky CTAs */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '14px 20px 22px',
        background: `linear-gradient(to top, ${t.bg} 70%, transparent)`,
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <PrimaryButton t={t} onClick={() => nav('workoutActive')} leadingIcon={<IconPlay size={18} fill="currentColor" stroke="none"/>}>Start Workout</PrimaryButton>
        <SecondaryButton t={t} ghost onClick={toggleSaved}>{saved ? 'Saved for later ✓' : 'Save for later'}</SecondaryButton>
      </div>
    </div>
  );
}

function Chip({ icon, children, t }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '5px 10px', borderRadius: 999,
      background: t.surface, border: `1px solid ${t.border}`,
      fontSize: 12, color: t.textMuted, fontWeight: 500,
    }}>
      {icon}{children}
    </span>
  );
}

function SectionBlock({ title, suffix, children, t }) {
  return (
    <div style={{ marginTop: 18 }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        marginBottom: 10,
      }}>
        <span style={{ fontSize: 11.5, color: t.textSoft, fontWeight: 600, letterSpacing: 0.04, textTransform: 'uppercase' }}>{title}</span>
        {suffix}
      </div>
      <div style={{
        background: t.surface, border: `1px solid ${t.border}`,
        borderRadius: t.radius, padding: 14,
      }}>{children}</div>
    </div>
  );
}

Object.assign(window, { DashboardScreen, WorkoutDetailScreen, HeroProgress, ProgressRing, Chip, SectionBlock });
