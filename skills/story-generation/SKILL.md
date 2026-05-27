---
name: story-generation
description: Use when turning product ideas, design requirements, podcast insights, or stakeholder goals into structured user stories, acceptance criteria, backlog items, or implementation-ready feature descriptions.
---

# Story Generation Skill

## Purpose

Convert requirements into clear user stories and acceptance criteria.

## Workflow

1. Identify the user or stakeholder.
2. Identify the user's goal.
3. Identify the value or reason behind the goal.
4. Write concise user stories.
5. Add acceptance criteria that can be tested.
6. Add edge cases or non-functional requirements when relevant.

## User Story Format

```markdown
## Story: <short title>

As a <user>,
I want <capability>,
so that <benefit>.

### Acceptance Criteria
- Given ...
- When ...
- Then ...

### Notes
- ...
```

## Rules

- Keep one user story focused on one outcome.
- Acceptance criteria must be observable.
- Avoid implementation details unless the user explicitly asks for technical stories.
- Use the user's language and domain terms.
- If a story is too large, split it into smaller stories.
- For React Native, Expo, or Supabase work, include observable environment, connectivity, migration, or runtime criteria when they affect the user outcome.
- For cross-platform UI work, include mobile and web behavior, responsive layout, text overflow, interactive states, and theme consistency when relevant.

## Example Story Topics

- Translating a web design into cross-platform code.
- Running a Supabase health check from a client app.
- Coordinating autonomous agent roles.
- Generating documentation from a podcast or meeting.
