---
name: worker
description: Use when executing a concrete implementation task from an existing plan, including editing files, creating artifacts, running commands, verifying behavior, and reporting exactly what changed.
---

# Worker Skill

## Purpose

Execute assigned work reliably and verify the result.

## Workflow

1. Confirm the assigned task and files or artifacts to touch.
2. Inspect relevant existing files before editing.
3. Make the smallest complete change that satisfies the assignment.
4. Run the relevant verification command.
5. Report changed files, verification result, and any remaining issues.

## Implementation Rules

- Follow existing project patterns.
- Avoid unrelated refactors.
- Do not overwrite work outside the assigned scope.
- Keep generated files readable and structured.
- If verification fails, report the exact failure and fix it when possible.

## React Native / Supabase Rules

- Check which app or package is being changed before editing: mobile app, admin web app, shared package, Supabase function, or database migration.
- Read existing `.env.example` files before adding variables.
- Use `EXPO_PUBLIC_` variables for Expo client-side configuration.
- Use the Supabase `anon public` key for client-side API calls; never put a `service_role` key in an Expo app.
- Test Supabase connectivity before debugging app code when endpoint behavior is unclear.
- For a basic health check, call a public Supabase API endpoint such as `/auth/v1/settings` with the `apikey` header.
- Edge Function URLs only work after deployment to the correct project ref.
- A `404 NOT_FOUND` from `/functions/v1/<name>` usually means the function is missing or deployed to another project.
- A `401` or `403` usually means the key or auth header is wrong.
- Keep schema changes in `supabase/migrations` and seed data in `supabase/seeds`.
- If REST returns `PGRST205`, check whether the table exists in the remote schema cache and whether the migration has run.
- Restart Expo after changing `.env` files.

## Cross-Platform UI Rules

- Use React Native primitives unless the repo already uses a higher-level UI kit.
- Avoid web-only DOM APIs inside shared components.
- Guard browser-only logic behind `globalThis.window` checks.
- Use `StyleSheet.create` consistently when existing files do.
- Put reusable UI in the shared component package when both apps can use it.
- Keep screen-specific orchestration inside the app.
- Use explicit prop names that describe product concepts, not visual implementation details.
- Keep layout responsive with flexible containers, stable spacing, and text that can wrap.
- Verify native and web behavior when changing shared UI.

## Output Format

```markdown
## Completed Work
- ...

## Changed Files
- ...

## Verification
- ...

## Remaining Issues
- ...
```

## Quality Checklist

- The task is fully implemented.
- The implementation matches the plan.
- No unrelated files were changed.
- The result was tested or manually verified.
- Supabase endpoint, Edge Function, or migration behavior was verified when touched.
- Cross-platform UI adapts to narrow and wide screens without text overflow.
