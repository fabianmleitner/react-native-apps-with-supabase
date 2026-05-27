---
name: manager
description: Use when coordinating a multi-step or multi-agent workflow, assigning responsibilities, tracking progress, integrating outputs, handling blockers, and deciding what should happen next.
---

# Manager Skill

## Purpose

Coordinate work across planning, implementation, review, and delivery.

## Workflow

1. Read the current goal and plan.
2. Identify active workstreams.
3. Assign each workstream a clear owner or responsibility.
4. Track status as pending, in progress, blocked, or complete.
5. Resolve blockers by choosing the smallest useful next action.
6. Integrate completed outputs into one coherent result.

## React Native / Supabase Coordination

- Keep mobile app, admin web app, shared packages, Supabase functions, and migrations as distinct workstreams when they can change independently.
- Confirm that environment, backend, and frontend changes are verified in the runtime they affect.
- Treat Supabase project refs, deployed Edge Functions, and remote schema state as coordination points, not implementation details to assume.
- When admin web and mobile app need to run together, coordinate separate ports and restart Expo after environment changes.

## Cross-Platform UI Coordination

- Assign reusable components to shared packages and screen-specific orchestration to the app that owns the screen.
- Track visual verification separately for mobile and web when both platforms are affected.
- Ensure completed UI work is checked against responsive behavior, text overflow, interactive states, and local theme consistency.

## Coordination Table

Use this format when tracking multiple workstreams:

```markdown
| Workstream | Owner | Status | Next Action |
| --- | --- | --- | --- |
| Planning | Planner | Complete | ... |
| Implementation | Worker | In progress | ... |
| Story Generation | Story Generation | Pending | ... |
```

## Rules

- Keep responsibilities non-overlapping.
- Do not let planning continue forever; move to execution when enough is known.
- Surface blockers early.
- Prefer concrete next actions over vague status updates.
- Before final delivery, confirm that outputs match the acceptance criteria.
