// Design tokens for Workout App — exported to window.WA_TOKENS

const PALETTES = {
  teal:   { accent: 'oklch(68% 0.12 175)', accentDeep: 'oklch(38% 0.08 175)', accentSoft: 'oklch(94% 0.04 175)' },
  forest: { accent: 'oklch(58% 0.14 150)', accentDeep: 'oklch(32% 0.09 150)', accentSoft: 'oklch(93% 0.05 150)' },
  lime:   { accent: 'oklch(78% 0.18 130)', accentDeep: 'oklch(36% 0.10 140)', accentSoft: 'oklch(95% 0.06 130)' },
  cobalt: { accent: 'oklch(58% 0.16 250)', accentDeep: 'oklch(32% 0.10 250)', accentSoft: 'oklch(94% 0.04 250)' },
};

const BACKGROUNDS = {
  linen:   { bg: '#F6F2EA', bgDeep: '#EBE5D8', textSoft: '#6B6F73' },
  paper:   { bg: '#F4F4F2', bgDeep: '#E9E9E4', textSoft: '#6B6F73' },
  warmer:  { bg: '#F4EDDF', bgDeep: '#E7DFCE', textSoft: '#6E665A' },
  cool:    { bg: '#F2F4F6', bgDeep: '#E5E9ED', textSoft: '#5E6770' },
};

const DARK = {
  bg: '#0E1013', bgDeep: '#15181C', textSoft: 'rgba(235,235,245,0.6)',
};

function buildTokens(t) {
  const pal = PALETTES[t.palette] || PALETTES.teal;
  const isDark = t.theme === 'dark';
  const base = isDark ? DARK : (BACKGROUNDS[t.background] || BACKGROUNDS.linen);
  const density = t.density || 'comfy';
  const radius = density === 'tight' ? 18 : 22;
  return {
    // surfaces
    bg: base.bg,
    bgDeep: base.bgDeep,
    surface: isDark ? '#181B1F' : '#FFFFFF',
    surfaceAlt: isDark ? '#212429' : '#FBF8F2',
    border: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(20,24,28,0.06)',
    borderStrong: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(20,24,28,0.1)',
    // text
    text: isDark ? '#F5F5F7' : '#15181C',
    textMuted: isDark ? 'rgba(235,235,245,0.7)' : '#4B5057',
    textSoft: base.textSoft,
    // accents
    accent: pal.accent,
    accentDeep: pal.accentDeep,
    accentSoft: isDark ? 'rgba(255,255,255,0.08)' : pal.accentSoft,
    accentInk: isDark ? '#0E1013' : '#0B1410',
    // difficulty
    diffBeginner:    { bg: 'oklch(95% 0.05 150)',  fg: 'oklch(36% 0.10 150)' },
    diffIntermediate:{ bg: 'oklch(94% 0.06 70)',   fg: 'oklch(42% 0.10 60)' },
    diffAdvanced:    { bg: 'oklch(93% 0.05 25)',   fg: 'oklch(46% 0.16 25)' },
    // health
    healthIdle:      { bg: '#E9EAEC', fg: '#55595F' },
    healthLoading:   { bg: 'oklch(94% 0.06 70)',  fg: 'oklch(42% 0.10 60)' },
    healthHealthy:   { bg: 'oklch(95% 0.05 150)', fg: 'oklch(34% 0.10 150)' },
    healthUnhealthy: { bg: 'oklch(93% 0.05 25)',  fg: 'oklch(46% 0.16 25)' },
    // shape
    radius,
    radiusSm: 12,
    radiusLg: 28,
    // spacing
    pad: density === 'tight' ? 14 : 18,
    rowGap: density === 'tight' ? 10 : 14,
    // fonts
    fontDisplay: '"Inter Display", "Inter", -apple-system, system-ui, sans-serif',
    fontBody: '"Inter", -apple-system, system-ui, sans-serif',
    fontMono: '"JetBrains Mono", ui-monospace, "SF Mono", monospace',
    isDark,
    density,
  };
}

window.WA_buildTokens = buildTokens;
window.WA_PALETTES = PALETTES;
window.WA_BACKGROUNDS = BACKGROUNDS;
