// Main app: design canvas with all phones, plus Tweaks panel

function App() {
  const [tweaks, setTweak] = useTweaks(/*EDITMODE-BEGIN*/{
    "palette": "teal",
    "background": "linen",
    "theme": "light",
    "density": "comfy"
  }/*EDITMODE-END*/);

  const t = window.WA_buildTokens(tweaks);

  // Inject base font + body style + animations
  React.useEffect(() => {
    document.body.style.background = '#EFECE4';
    document.body.style.fontFamily = t.fontBody;
    document.body.style.color = t.text;
  }, [t]);

  const PHONE_W = 360;
  const PHONE_H = 760;

  return (
    <>
      <DesignCanvas>
        <DCSection id="flow" title="Onboarding flow" subtitle="From first launch to ready-to-train">
          <DCArtboard id="splash"      label="01 · Splash"          width={PHONE_W} height={PHONE_H}>
            <Phone tokens={t} initialScreen="splash"     height={PHONE_H}/>
          </DCArtboard>
          <DCArtboard id="onboarding"  label="02 · Onboarding"      width={PHONE_W} height={PHONE_H}>
            <Phone tokens={t} initialScreen="onboarding" height={PHONE_H}/>
          </DCArtboard>
          <DCArtboard id="register"    label="03 · Register"        width={PHONE_W} height={PHONE_H}>
            <Phone tokens={t} initialScreen="register"   height={PHONE_H}/>
          </DCArtboard>
          <DCArtboard id="success"     label="04 · Account ready"   width={PHONE_W} height={PHONE_H}>
            <Phone tokens={t} initialScreen="register" height={PHONE_H}
              initialState={{ register: { name: 'Fabian Hartmann', email: 'fabian@workout.app', password: '********', goal: 'strength', success: true } }}/>
          </DCArtboard>
        </DCSection>

        <DCSection id="app" title="Main app" subtitle="Bottom-tab navigation · tap any tab inside a phone">
          <DCArtboard id="dashboard"   label="05 · Dashboard"       width={PHONE_W} height={PHONE_H}>
            <Phone tokens={t} initialScreen="dashboard"  height={PHONE_H}/>
          </DCArtboard>
          <DCArtboard id="detail"      label="06 · Workout Detail"  width={PHONE_W} height={PHONE_H}>
            <Phone tokens={t} initialScreen="workoutDetail" height={PHONE_H}/>
          </DCArtboard>
          <DCArtboard id="progress"    label="07 · Progress"        width={PHONE_W} height={PHONE_H}>
            <Phone tokens={t} initialScreen="progress"   height={PHONE_H}/>
          </DCArtboard>
          <DCArtboard id="workouts"    label="08 · Workouts list"   width={PHONE_W} height={PHONE_H}>
            <Phone tokens={t} initialScreen="workouts"   height={PHONE_H}/>
          </DCArtboard>
          <DCArtboard id="profile"     label="09 · Profile"         width={PHONE_W} height={PHONE_H}>
            <Phone tokens={t} initialScreen="profile"    height={PHONE_H}/>
          </DCArtboard>
        </DCSection>

        <DCSection id="utility" title="Utility & states" subtitle="Dev surfaces and component states">
          <DCArtboard id="health"      label="10 · Health check"    width={PHONE_W} height={PHONE_H}>
            <Phone tokens={t} initialScreen="health"     height={PHONE_H}/>
          </DCArtboard>
          <DCArtboard id="active"      label="11 · Active session"  width={PHONE_W} height={PHONE_H}>
            <Phone tokens={t} initialScreen="workoutActive" height={PHONE_H}/>
          </DCArtboard>
          <DCArtboard id="components"  label="12 · Component library" width={520} height={PHONE_H}>
            <ComponentSheet t={t}/>
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Workout App · Tweaks">
        <TweakSection label="Color">
          <TweakSelect label="Accent palette" value={tweaks.palette}
            onChange={v => setTweak('palette', v)}
            options={[
              { label: 'Teal (default)',     value: 'teal' },
              { label: 'Forest green',       value: 'forest' },
              { label: 'Electric lime',      value: 'lime' },
              { label: 'Cobalt blue',        value: 'cobalt' },
            ]}/>
          <TweakRadio label="Theme" value={tweaks.theme}
            onChange={v => setTweak('theme', v)}
            options={[{ label: 'Light', value: 'light' }, { label: 'Dark', value: 'dark' }]}/>
          <TweakSelect label="Background tone" value={tweaks.background}
            onChange={v => setTweak('background', v)}
            options={[
              { label: 'Linen (warm light)', value: 'linen' },
              { label: 'Paper (neutral)',    value: 'paper' },
              { label: 'Warmer cream',       value: 'warmer' },
              { label: 'Cool grey',          value: 'cool' },
            ]}/>
        </TweakSection>
        <TweakSection label="Layout">
          <TweakRadio label="Density" value={tweaks.density}
            onChange={v => setTweak('density', v)}
            options={[{ label: 'Comfy', value: 'comfy' }, { label: 'Tight', value: 'tight' }]}/>
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Component library sheet — Buttons, Badges, Pills, States
// ─────────────────────────────────────────────────────────────
function ComponentSheet({ t }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: t.bg,
      padding: 26, overflowY: 'auto', boxSizing: 'border-box',
      fontFamily: t.fontBody, color: t.text,
    }}>
      <div style={{ fontFamily: t.fontDisplay, fontSize: 22, fontWeight: 600, color: t.text, letterSpacing: -0.5, marginBottom: 4 }}>Component library</div>
      <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 22 }}>Atomic pieces used across every screen.</div>

      <SheetBlock t={t} title="Buttons">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <PrimaryButton t={t}>Primary action</PrimaryButton>
          <PrimaryButton t={t} leadingIcon={<IconPlay size={16} fill="currentColor" stroke="none"/>}>Start Workout</PrimaryButton>
          <PrimaryButton t={t} disabled>Disabled</PrimaryButton>
          <SecondaryButton t={t}>Secondary action</SecondaryButton>
          <SecondaryButton t={t} ghost>Ghost link</SecondaryButton>
        </div>
      </SheetBlock>

      <SheetBlock t={t} title="Difficulty badges">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <DifficultyBadge level="Beginner" t={t}/>
          <DifficultyBadge level="Intermediate" t={t}/>
          <DifficultyBadge level="Advanced" t={t}/>
        </div>
      </SheetBlock>

      <SheetBlock t={t} title="Health status pills">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['IDLE','LOADING','HEALTHY','UNHEALTHY'].map(s => <HealthStatusPill key={s} status={s} t={t}/>)}
        </div>
      </SheetBlock>

      <SheetBlock t={t} title="Workout card">
        <WorkoutCard workout={WA_WORKOUTS[0]} t={t}/>
      </SheetBlock>

      <SheetBlock t={t} title="Stat card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          <ProgressStatCard t={t} label="Workouts" value="14" sublabel="this month" icon={<IconDumbbell size={14}/>}/>
          <ProgressStatCard t={t} label="Streak" value="12" unit="d" sublabel="best: 24 d"
            accent="oklch(64% 0.16 45)" icon={<IconFlame size={14}/>}/>
        </div>
      </SheetBlock>

      <SheetBlock t={t} title="Empty state">
        <EmptyState t={t} title="No saved workouts" body="Bookmark a session from the catalogue to find it again here." icon={<IconBookmark size={22}/>}/>
      </SheetBlock>

      <SheetBlock t={t} title="Loading state">
        <LoadingState t={t} label="LOADING SESSIONS"/>
      </SheetBlock>
    </div>
  );
}

function SheetBlock({ title, children, t }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{
        fontSize: 11, color: t.textSoft, fontWeight: 600, letterSpacing: 0.06,
        textTransform: 'uppercase', marginBottom: 10,
      }}>{title}</div>
      {children}
    </div>
  );
}

Object.assign(window, { App, ComponentSheet });
