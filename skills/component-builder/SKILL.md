---
name: component-builder
description: Use when implementing a new React Native UI component (atom, molecule, or organism) for the shared-components design system. Guides file placement, token usage, prop design, StyleSheet conventions, and export wiring so every component is consistent and ready for Storybook.
---

# Component Builder Skill

## Purpose

Implement production-ready React Native components (atoms, molecules, organisms) that follow the existing design system conventions, use the shared token set, and are immediately consumable in the Storybook.

## Design System Hierarchy

| Layer | Definition | Examples |
|---|---|---|
| **Atom** | Smallest indivisible UI unit, no composition of other design-system components | Button, Chip, DifficultyBadge, HealthPill, WorkoutGlyph |
| **Molecule** | Composes 2–3 atoms into a named product concept | WorkoutCard, StatCard, BenefitCard, SectionHeader, IconButton |
| **Organism** | Composes molecules / atoms into a self-contained section | BottomTabs, HeroProgress |
| **Screen** | Full screen layout that wires organisms together | DashboardScreen, HealthScreen |

## Workflow

1. Confirm the layer (atom / molecule / organism) and the component name.
2. Read `packages/shared-components/src/design-system/tokens.ts` for available colors, spacing, radius, and typography values.
3. Read the closest existing sibling component (same layer) as a reference for patterns.
4. Create the file at the correct path (see below).
5. Implement the component using React Native primitives (`View`, `Text`, `Pressable`, `ScrollView`, `Image`).
6. Export the component and its prop type from `packages/shared-components/src/design-system/index.ts`.
7. Verify the file compiles: `npm run check-types --workspace @workout/shared-components`.
8. Hand off to the **storybook-writer** skill to create the accompanying story.

## File Paths

```
packages/shared-components/src/design-system/
  atoms/        ← <ComponentName>.tsx
  molecules/    ← <ComponentName>.tsx
  organisms/    ← <ComponentName>.tsx
  screens/      ← <ComponentName>.tsx (not covered by this skill)
  tokens.ts     ← read only; never modify tokens here
  index.ts      ← add new exports here
```

## Token Usage Rules

- **Always** import from `../tokens` — never hardcode hex colors, spacing numbers, or border-radius values.
- Use `workoutColors.*` for all color values.
- Use `workoutSpacing.*` for padding and margin.
- Use `workoutRadius.*` for border-radius (`sm=10`, `md=14`, `lg=22`, `xl=28`, `pill=999`).
- Use `workoutTypography.*` for text styles when a named style exists; extend with `fontWeight` overrides as needed.

## StyleSheet Rules

- Always use `StyleSheet.create({})` — no inline style objects except for computed/dynamic values.
- Dynamic values (selected state, conditional color) belong in the `style={[styles.base, condition && styles.variant]}` array.
- Keep style keys descriptive of role, not appearance: `container`, `label`, `icon`, `badge` — not `blueBox`, `bigText`.

## Prop Design Rules

- Use explicit, product-domain prop names: `workout`, `level`, `active`, `status` — not `data`, `type`, `flag`.
- Export a named `interface` for every component's props (`ComponentNameProps`).
- Mark props `optional` when a sensible default exists; provide the default via destructuring default values.
- Never pass navigation functions as required props on atoms or molecules — use `onPress?: () => void`.

## Component Template

```tsx
import { StyleSheet, Text, View } from 'react-native';

import { workoutColors, workoutRadius, workoutSpacing } from '../tokens';

export interface ExampleProps {
  label: string;
  variant?: 'default' | 'highlighted';
}

export function Example({ label, variant = 'default' }: ExampleProps) {
  return (
    <View style={[styles.container, variant === 'highlighted' && styles.highlighted]}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: workoutSpacing.md,
    borderRadius: workoutRadius.md,
    backgroundColor: workoutColors.surface,
    borderWidth: 1,
    borderColor: workoutColors.border
  },
  highlighted: {
    backgroundColor: workoutColors.accentSoft,
    borderColor: workoutColors.accent
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: workoutColors.text
  }
});
```

## Export Wiring (index.ts)

Add to `packages/shared-components/src/design-system/index.ts`:

```ts
export { Example } from './atoms/Example';          // or molecules/ or organisms/
export type { ExampleProps } from './atoms/Example';
```

## Quality Checklist

- [ ] Correct layer folder (atoms / molecules / organisms).
- [ ] All colors, spacing, radius reference tokens — no magic numbers.
- [ ] `StyleSheet.create` used throughout.
- [ ] Props interface exported with `Props` suffix.
- [ ] Default prop values provided for optional props.
- [ ] Component and props exported in `design-system/index.ts`.
- [ ] `npm run check-types` passes.
- [ ] Story created by **storybook-writer** skill.
