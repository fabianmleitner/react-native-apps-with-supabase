// Minimal stroked icon set, sized via `size` prop. Color defaults to currentColor.

const Icon = ({ d, size = 22, stroke = 'currentColor', fill = 'none', strokeWidth = 1.8, children, viewBox = '0 0 24 24' }) => (
  <svg width={size} height={size} viewBox={viewBox} fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {d ? <path d={d} /> : children}
  </svg>
);

const IconHome = (p) => <Icon {...p}><path d="M3.5 10.5 12 3.5l8.5 7" /><path d="M5.5 9.5V20h4.25v-5.25h4.5V20H18.5V9.5" /></Icon>;
const IconDumbbell = (p) => <Icon {...p}><path d="M6 9v6" /><path d="M3 11v2" /><path d="M18 9v6" /><path d="M21 11v2" /><path d="M6 12h12" /></Icon>;
const IconChart = (p) => <Icon {...p}><path d="M4 20V4" /><path d="M4 20h16" /><path d="M8 16v-4" /><path d="M12 16V8" /><path d="M16 16v-6" /></Icon>;
const IconHeart = (p) => <Icon {...p}><path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10Z" /></Icon>;
const IconUser = (p) => <Icon {...p}><circle cx="12" cy="8" r="3.5" /><path d="M4.5 20c1-3.6 4-5.5 7.5-5.5s6.5 1.9 7.5 5.5" /></Icon>;
const IconChevronRight = (p) => <Icon {...p}><path d="m9 6 6 6-6 6" /></Icon>;
const IconChevronLeft = (p) => <Icon {...p}><path d="m15 6-6 6 6 6" /></Icon>;
const IconCheck = (p) => <Icon {...p}><path d="m5 12 5 5L20 7" /></Icon>;
const IconPlay = (p) => <Icon {...p}><path d="M7 5v14l12-7Z" /></Icon>;
const IconClock = (p) => <Icon {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l2.8 2" /></Icon>;
const IconFlame = (p) => <Icon {...p}><path d="M12 3s4 4 4 8a4 4 0 1 1-8 0c0-1.5.5-2.5 1.5-3.5C10 8.5 9 6 12 3Z" /></Icon>;
const IconBolt = (p) => <Icon {...p}><path d="M13 3 5 14h6l-1 7 8-11h-6l1-7Z" /></Icon>;
const IconTarget = (p) => <Icon {...p}><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1.2" /></Icon>;
const IconBookmark = (p) => <Icon {...p}><path d="M6.5 4.5h11v16l-5.5-3.5-5.5 3.5z" /></Icon>;
const IconSearch = (p) => <Icon {...p}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-3.5-3.5" /></Icon>;
const IconBell = (p) => <Icon {...p}><path d="M6 16V11a6 6 0 1 1 12 0v5" /><path d="M4.5 17.5h15" /><path d="M10 20.5h4" /></Icon>;
const IconPlus = (p) => <Icon {...p}><path d="M12 5v14M5 12h14" /></Icon>;
const IconRefresh = (p) => <Icon {...p}><path d="M3.5 12a8.5 8.5 0 0 1 14.5-6L20 8" /><path d="M20 4v4h-4" /><path d="M20.5 12a8.5 8.5 0 0 1-14.5 6L4 16" /><path d="M4 20v-4h4" /></Icon>;
const IconArrowRight = (p) => <Icon {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Icon>;
const IconEye = (p) => <Icon {...p}><path d="M2.5 12C5 7 8.5 5 12 5s7 2 9.5 7c-2.5 5-6 7-9.5 7s-7-2-9.5-7Z" /><circle cx="12" cy="12" r="2.8" /></Icon>;
const IconEyeOff = (p) => <Icon {...p}><path d="m4 4 16 16" /><path d="M9.5 5.5A11 11 0 0 1 12 5c3.5 0 7 2 9.5 7a13 13 0 0 1-3.3 4.2" /><path d="M6 7.5C4.2 8.8 3.1 10.4 2.5 12c2.5 5 6 7 9.5 7 1.4 0 2.8-.4 4-1" /></Icon>;
const IconCircle = (p) => <Icon {...p}><circle cx="12" cy="12" r="9" /></Icon>;
const IconDot = (p) => <Icon {...p} fill="currentColor" strokeWidth="0"><circle cx="12" cy="12" r="4" /></Icon>;
const IconSettings = (p) => <Icon {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1A2 2 0 1 1 4.4 17l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8L4.2 7a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1A2 2 0 1 1 19.7 7l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.2.6.7 1 1.4 1.1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" /></Icon>;
const IconLogo = ({ size = 28, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path d="M2 17 L8 17 L10 12 L14 22 L18 8 L22 20 L24 17 L30 17"
      stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

Object.assign(window, {
  IconHome, IconDumbbell, IconChart, IconHeart, IconUser, IconChevronRight, IconChevronLeft,
  IconCheck, IconPlay, IconClock, IconFlame, IconBolt, IconTarget, IconBookmark,
  IconSearch, IconBell, IconPlus, IconRefresh, IconArrowRight, IconEye, IconEyeOff,
  IconCircle, IconDot, IconSettings, IconLogo,
});
