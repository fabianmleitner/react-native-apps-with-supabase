// Reusable UI components — buttons, badges, cards, status pills, empty/loading

function PrimaryButton({ children, onClick, leadingIcon, trailingIcon, full = true, t, disabled = false }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: full ? '100%' : 'auto',
      height: 56,
      borderRadius: 999,
      border: 'none',
      background: disabled ? 'rgba(20,24,28,0.12)' : t.accent,
      color: disabled ? t.textSoft : t.accentInk,
      fontFamily: t.fontBody,
      fontSize: 16,
      fontWeight: 600,
      letterSpacing: -0.1,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'transform 0.15s, opacity 0.15s',
      boxShadow: disabled ? 'none' : '0 8px 24px -10px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.2)',
    }} onMouseDown={e => !disabled && (e.currentTarget.style.transform = 'scale(0.985)')}
       onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
       onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
      {leadingIcon}
      <span>{children}</span>
      {trailingIcon}
    </button>
  );
}

function SecondaryButton({ children, onClick, t, full = true, leadingIcon, ghost = false }) {
  return (
    <button onClick={onClick} style={{
      width: full ? '100%' : 'auto',
      height: 56,
      borderRadius: 999,
      border: ghost ? 'none' : `1px solid ${t.borderStrong}`,
      background: ghost ? 'transparent' : t.surface,
      color: t.text,
      fontFamily: t.fontBody,
      fontSize: 16,
      fontWeight: 600,
      letterSpacing: -0.1,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      cursor: 'pointer',
      transition: 'transform 0.15s, background 0.15s',
    }}>
      {leadingIcon}
      {children}
    </button>
  );
}

function DifficultyBadge({ level, t, size = 'md' }) {
  const key = level === 'Beginner' ? 'diffBeginner' : level === 'Intermediate' ? 'diffIntermediate' : 'diffAdvanced';
  const c = t[key];
  const sm = size === 'sm';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: c.bg, color: c.fg,
      fontFamily: t.fontBody, fontWeight: 600,
      fontSize: sm ? 11 : 12, letterSpacing: 0.04,
      padding: sm ? '4px 8px' : '5px 10px',
      borderRadius: 999, textTransform: 'uppercase',
      lineHeight: 1,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: 999, background: c.fg }}/>
      {level}
    </span>
  );
}

function Card({ children, t, style, onClick, pad = true }) {
  return (
    <div onClick={onClick} style={{
      background: t.surface,
      borderRadius: t.radius,
      border: `1px solid ${t.border}`,
      padding: pad ? t.pad : 0,
      cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 0.15s, box-shadow 0.15s',
      ...style,
    }}>{children}</div>
  );
}

function WorkoutCard({ workout, onClick, t, dense = false }) {
  const { title, duration, level, focus, kcal } = workout;
  return (
    <div onClick={onClick} style={{
      background: t.surface,
      borderRadius: t.radius,
      border: `1px solid ${t.border}`,
      padding: dense ? 14 : t.pad,
      cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 14,
      transition: 'transform 0.15s',
    }}
      onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.99)')}
      onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
      <WorkoutGlyph focus={focus} t={t} size={dense ? 44 : 52} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: t.textSoft, fontWeight: 600, letterSpacing: 0.04, textTransform: 'uppercase' }}>{focus}</span>
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, color: t.text, letterSpacing: -0.2, marginBottom: 8, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: t.textMuted, fontWeight: 500 }}>
            <IconClock size={13} /> {duration} min
          </span>
          <span style={{ width: 3, height: 3, borderRadius: 999, background: t.borderStrong }} />
          <DifficultyBadge level={level} t={t} size="sm" />
        </div>
      </div>
      <div style={{
        width: 36, height: 36, borderRadius: 999,
        background: t.bgDeep, color: t.text,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <IconChevronRight size={16} />
      </div>
    </div>
  );
}

// Subtle abstract glyph for each focus area — square gradient tile with a glyph
function WorkoutGlyph({ focus, t, size = 52 }) {
  const colorMap = {
    'Lower Body': 'oklch(74% 0.12 175)',
    'Core': 'oklch(78% 0.13 70)',
    'Athletic': 'oklch(64% 0.16 25)',
    'Upper Body': 'oklch(68% 0.14 280)',
    'Mobility':   'oklch(74% 0.11 200)',
    'HIIT':       'oklch(70% 0.16 45)',
    'Recovery':   'oklch(76% 0.09 150)',
  };
  const c = colorMap[focus] || t.accent;
  return (
    <div style={{
      width: size, height: size, borderRadius: 14,
      background: `linear-gradient(135deg, color-mix(in oklch, ${c} 92%, white), color-mix(in oklch, ${c} 65%, black))`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', flexShrink: 0,
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -8px 12px -6px rgba(0,0,0,0.2)',
    }}>
      <IconDumbbell size={size * 0.5} stroke="white" strokeWidth={1.6} />
    </div>
  );
}

function HealthStatusPill({ status, t }) {
  const map = {
    IDLE: t.healthIdle,
    LOADING: t.healthLoading,
    HEALTHY: t.healthHealthy,
    UNHEALTHY: t.healthUnhealthy,
  };
  const c = map[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 7,
      background: c.bg, color: c.fg,
      fontFamily: t.fontMono, fontWeight: 600,
      fontSize: 11, letterSpacing: 0.08,
      padding: '6px 11px',
      borderRadius: 999,
    }}>
      {status === 'LOADING' ? (
        <span style={{
          width: 8, height: 8, borderRadius: 999,
          border: `1.5px solid ${c.fg}`, borderTopColor: 'transparent',
          animation: 'wa-spin 0.8s linear infinite',
        }}/>
      ) : (
        <span style={{ width: 6, height: 6, borderRadius: 999, background: c.fg, boxShadow: status === 'HEALTHY' ? `0 0 0 4px color-mix(in srgb, ${c.fg} 18%, transparent)` : 'none' }}/>
      )}
      {status}
    </span>
  );
}

function ProgressStatCard({ label, value, unit, accent, t, sublabel, icon }) {
  return (
    <div style={{
      background: t.surface, borderRadius: t.radius,
      border: `1px solid ${t.border}`,
      padding: 14,
      display: 'flex', flexDirection: 'column', gap: 10,
      minHeight: 92,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: t.textSoft, letterSpacing: 0.04, textTransform: 'uppercase' }}>{label}</span>
        {icon && (
          <span style={{
            width: 24, height: 24, borderRadius: 8,
            background: accent ? `color-mix(in srgb, ${accent} 14%, transparent)` : t.accentSoft,
            color: accent || t.accentDeep,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{icon}</span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontSize: 28, fontWeight: 600, color: t.text, fontFamily: t.fontDisplay, letterSpacing: -0.8, lineHeight: 1 }}>{value}</span>
        {unit && <span style={{ fontSize: 13, color: t.textMuted, fontWeight: 500 }}>{unit}</span>}
      </div>
      {sublabel && <div style={{ fontSize: 12, color: t.textSoft, marginTop: -2 }}>{sublabel}</div>}
    </div>
  );
}

function EmptyState({ title, body, t, icon, action }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      textAlign: 'center', padding: '28px 18px',
      gap: 10,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 18,
        background: t.bgDeep, color: t.textMuted,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 4,
      }}>{icon || <IconBookmark size={24} />}</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: t.text }}>{title}</div>
      <div style={{ fontSize: 13.5, color: t.textMuted, maxWidth: 240, lineHeight: 1.45 }}>{body}</div>
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  );
}

function LoadingState({ t, label = 'Loading…', rows = 3 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '4px 0' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{
          height: 76, borderRadius: t.radius,
          background: `linear-gradient(90deg, ${t.bgDeep}, color-mix(in srgb, ${t.bgDeep} 60%, transparent), ${t.bgDeep})`,
          backgroundSize: '200% 100%',
          animation: 'wa-shimmer 1.4s ease-in-out infinite',
          opacity: 0.8 - i * 0.18,
        }}/>
      ))}
      <div style={{ textAlign: 'center', fontSize: 12, color: t.textSoft, fontFamily: t.fontMono, letterSpacing: 0.06, marginTop: 4 }}>{label}</div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text', t, trailing, error }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: t.textMuted, letterSpacing: 0.02 }}>{label}</label>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: t.surface,
        border: `1px solid ${error ? t.diffAdvanced.fg : focused ? t.accent : t.border}`,
        borderRadius: 14,
        padding: '0 14px', height: 52,
        transition: 'border-color 0.15s',
      }}>
        <input
          type={type}
          value={value || ''}
          placeholder={placeholder}
          onChange={e => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontFamily: t.fontBody, fontSize: 15, color: t.text,
            letterSpacing: -0.1, height: '100%',
          }}/>
        {trailing}
      </div>
      {error && <span style={{ fontSize: 12, color: t.diffAdvanced.fg }}>{error}</span>}
    </div>
  );
}

function SectionHeader({ title, action, t }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      padding: '0 4px', marginBottom: 12,
    }}>
      <span style={{ fontSize: 17, fontWeight: 600, color: t.text, letterSpacing: -0.3 }}>{title}</span>
      {action && (
        <span onClick={action.onClick} style={{ fontSize: 13, color: t.accentDeep, fontWeight: 500, cursor: 'pointer' }}>{action.label}</span>
      )}
    </div>
  );
}

Object.assign(window, {
  PrimaryButton, SecondaryButton, DifficultyBadge, Card, WorkoutCard, WorkoutGlyph,
  HealthStatusPill, ProgressStatCard, EmptyState, LoadingState, Field, SectionHeader,
});
