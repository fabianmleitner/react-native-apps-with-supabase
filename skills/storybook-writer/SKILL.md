---
name: storybook-writer
description: Use when creating or updating Storybook stories for React Native components in the shared-components design system. Guides file placement, story naming, CSF3 format, decorator patterns for mobile layout, and how to cover all meaningful visual states of a component.
---

# Storybook Writer Skill

## Purpose

Write complete, well-structured Storybook stories (CSF 3 format) for every React Native component in the design system. Stories must show all meaningful visual states, run without errors in the web-based Storybook (via `react-native-web`), and appear under the correct title hierarchy.

## Storybook Setup

| Setting | Value |
|---|---|
| Framework | `@storybook/react-webpack5` |
| RN → Web alias | `react-native` → `react-native-web` (auto-configured in `main.ts`) |
| Story glob | `packages/shared-components/stories/**/*.stories.@(ts|tsx)` |
| Dev server | `npm run storybook --workspace @workout/shared-components` (port 6006) |
| Story format | **CSF 3** — `export default meta; export const StoryName = { args: {} }` |

## Workflow

1. Read the component file to understand all props, variants, and states.
2. Identify the layer: atom / molecule / organism / screen.
3. Create the story file at the correct path (see below).
4. Write a `meta` object with `title`, `component`, `parameters`, and optional `args`.
5. Export one named story per meaningful state (see coverage rules below).
6. Verify the Storybook server builds without error: `npm run storybook --workspace @workout/shared-components`.

## File Paths

```
packages/shared-components/stories/
  atoms/        ← <ComponentName>.stories.tsx
  molecules/    ← <ComponentName>.stories.tsx
  organisms/    ← <ComponentName>.stories.tsx
  screens/      ← <ComponentName>.stories.tsx
```

## Title Hierarchy

```
Design System/Atoms/<ComponentName>
Design System/Molecules/<ComponentName>
Design System/Organisms/<ComponentName>
Design System/Screens/<ComponentName>
```

## Import Rule

Always import from `'../../src'` (the package index), never from deep source paths:

```ts
import { WorkoutButton } from '../../src';  // ✅
import { WorkoutButton } from '../../src/design-system/atoms/Button'; // ❌
```

## Story Coverage Rules

### Atoms
- One story per discrete variant or state value.
- If the component has 3+ enum states (e.g. difficulty levels, health statuses), use a single `AllStates` story with a `render` function that shows all states side-by-side.

### Molecules
- One story per named content variation (e.g. different workout types, stat labels).
- Add a story for empty / missing optional content when the component supports it.

### Organisms
- One story per primary interactive state (e.g. active tab).
- Use `args` for controllable props — avoid hardcoded `render` functions unless state cannot be expressed as args.

### Screens
- One story per screen state (loading, populated, empty).
- Wrap in a `ScrollView` decorator when the screen is scrollable.

## Decorator Patterns

Use decorators to provide mobile-like framing:

```tsx
// Centered single component
decorators: [
  (Story) => (
    <View style={{ width: 360, padding: 20 }}>
      <Story />
    </View>
  )
]

// Row of atoms
render: () => (
  <View style={{ flexDirection: 'row', gap: 8 }}>
    <MyAtom variant="a" />
    <MyAtom variant="b" />
  </View>
)

// Full-screen organism/screen
decorators: [
  (Story) => (
    <View style={{ width: 390, minHeight: 844, backgroundColor: '#F6F2EA' }}>
      <Story />
    </View>
  )
]
```

## CSF 3 Templates

### Atom with variants

```tsx
import React from 'react';
import { View } from 'react-native';

import { MyAtom } from '../../src';

const meta = {
  title: 'Design System/Atoms/MyAtom',
  component: MyAtom,
  parameters: { layout: 'centered' }
};

export default meta;

export const AllStates = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <MyAtom variant="default" />
      <MyAtom variant="active" />
    </View>
  )
};
```

### Atom with args

```tsx
import { WorkoutButton } from '../../src';

const meta = {
  title: 'Design System/Atoms/Button',
  component: WorkoutButton,
  parameters: { layout: 'centered' },
  decorators: [
    (Story: React.ComponentType) => (
      <View style={{ width: 320, gap: 10 }}>
        <Story />
      </View>
    )
  ]
};

export default meta;

export const Primary   = { args: { label: 'Get Started', variant: 'primary' } };
export const Secondary = { args: { label: 'Save for later', variant: 'secondary' } };
export const Disabled  = { args: { label: 'Create Account', disabled: true } };
```

### Molecule with fixture data

```tsx
import { DesignWorkoutCard, workoutFixtures } from '../../src';

const meta = {
  title: 'Design System/Molecules/WorkoutCard',
  component: DesignWorkoutCard,
  parameters: { layout: 'centered' },
  args: { workout: workoutFixtures[0] }
};

export default meta;

export const Intermediate = {};
export const Beginner     = { args: { workout: workoutFixtures[1] } };
export const Advanced     = { args: { workout: workoutFixtures[2] } };
```

### Organism with active state

```tsx
import { BottomTabs } from '../../src';

const meta = {
  title: 'Design System/Organisms/BottomTabs',
  component: BottomTabs,
  parameters: { layout: 'centered' },
  args: { active: 'dashboard' }
};

export default meta;

export const HomeActive     = {};
export const ProgressActive = { args: { active: 'progress' } };
```

## Quality Checklist

- [ ] File placed in the correct `stories/<layer>/` folder.
- [ ] Title follows `Design System/<Layer>/<Name>` convention.
- [ ] All imports come from `'../../src'`.
- [ ] CSF 3 format (`export default meta; export const Name = { ... }`).
- [ ] Every meaningful variant / state has its own named export.
- [ ] No TypeScript errors (`npm run check-types`).
- [ ] Story renders correctly in Storybook at port 6006.
