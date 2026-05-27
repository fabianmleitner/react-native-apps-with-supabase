---
name: planner
description: Use when an agent workflow needs to break a product, design, or software task into clear goals, constraints, milestones, dependencies, risks, and implementation steps before execution begins.
---

# Planner Skill

## Purpose

Create a practical execution plan before implementation starts.

## Workflow

1. Restate the goal in one or two concrete sentences.
2. Identify required inputs, missing information, and assumptions.
3. Break the work into ordered milestones.
4. Separate blocking tasks from parallelizable tasks.
5. Define acceptance criteria for the final result.
6. List risks that could change the implementation.

## React Native / Supabase Planning

- Identify whether the target is the mobile app, admin web app, shared package, Supabase function, or database layer.
- Read existing `.env.example` files before planning new environment variables.
- For Expo client-side values, plan around `EXPO_PUBLIC_` variables and the Supabase `anon public` key.
- Never plan to expose a Supabase `service_role` key in an Expo app.
- Include connectivity checks for Supabase URLs, Edge Functions, and migrations when backend behavior is part of the task.
- Do not assume local Supabase and remote Supabase have the same schema.

## Cross-Platform UI Planning

- Identify target platforms first: mobile, web, or both.
- Break visual designs into reusable UI components before screen-level work.
- Prefer existing project components, theme tokens, styles, and package structure.
- Plan shared components when the same UI appears in more than one app or screen.
- Include responsive layout, text wrapping, interactive states, and visual verification in acceptance criteria.

## Output Format

Use this structure:

```markdown
# Plan

## Goal
- ...

## Assumptions
- ...

## Milestones
- ...

## Dependencies
- ...

## Risks
- ...

## Acceptance Criteria
- ...
```

## Rules

- Keep the plan actionable, not theoretical.
- Do not invent requirements when the user provided enough context.
- Mark uncertain assumptions clearly.
- Prefer small milestones that can be verified independently.
- Include validation steps such as tests, screenshots, builds, or manual checks when relevant.
