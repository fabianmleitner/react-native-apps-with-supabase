---
name: cdd-analysis-skill
description: Prepare raw HTML/CSS app prototypes for automated React Native conversion by injecting traceable IDs, deduplicating elements, classifying UI parts with CDD/Atomic Design rules, and maintaining workflow-progress.json checkpoints.
---

# CDD Analysis Skill

## Purpose

Use this skill when a raw HTML/CSS prototype must be prepared for later React Native or Flutter implementation. The skill converts large prototype folders into compact JSON checkpoints so smaller implementation agents can work from stable component records instead of full HTML files.

## Required Inputs

- Prototype root: `docs/ui/prototypes/[app-name]/`
- Required screens:
  - `auth/landing.html`
  - `auth/registration.html`
  - `auth/login.html`
  - `overview/overview.html`
- Target framework: default `react-native`

## Workflow

1. Run `scripts/deduplicate_and_parse.py` against the prototype root.
2. Read only the generated JSON files first:
   - `cdd-output/deduplicated-components.json`
   - `workflow-progress.json`
3. Classify only canonical components from `deduplication.components`.
4. Store classification and consolidation decisions in `workflow-progress.json`.
5. Use `data-agent-id` values as the only source of traceability. Do not invent component IDs outside the generated IDs.

Example command:

```bash
python3 cdd-analysis-skill/scripts/deduplicate_and_parse.py docs/ui/prototypes/workout-tracker --app-name workout-tracker --target-framework react-native
```

## ID Rules

- Every visible, relevant HTML node receives `data-agent-id`.
- Generated IDs use deterministic CDD prefixes:
  - `atm-*` for atoms
  - `mol-*` for molecules
  - `org-*` for organisms
- Existing `cdd-id` or `data-agent-id` values are preserved.
- All later references must point to `data-agent-id`, `canonical_cdd_id`, or `duplicate_cdd_ids`.

## Classification Rules

Classify from evidence in `deduplicated-components.json`: tag, text, class, child tags, source file, duplicate list, and nearby naming hints. If evidence is insufficient, use `needs_review`, not a guessed category.

### Atoms

An atom is the smallest reusable visible UI part and must not require another visible component to make sense.

Classify as atom when one of these is true:

- Native interactive primitive: `button`, `input`, `textarea`, `select`, simple `a`.
- Single text primitive: heading, paragraph, label, badge text, helper text, counter text.
- Single media primitive: image, icon placeholder, glyph, avatar image.
- Decorative primitive that maps cleanly to one React Native `View`, `Text`, `Pressable`, `TextInput`, or `Image`.

Atoms may have styling and state variants, but no named child component dependencies.

### Molecules

A molecule combines two or more atoms into one reusable unit with a single local purpose.

Classify as molecule when one of these is true:

- Form field group: label plus input plus helper/error text.
- Card row or list item: icon/text/action grouped as one repeated item.
- CTA block: button plus caption, icon plus label, or segmented option.
- Stat card, benefit card, workout card preview, tab item, or compact toolbar item.

Molecules must list their atom dependencies in `workflow-progress.json`.

### Organisms

An organism is a larger region that coordinates multiple molecules and/or atoms into a screen section.

Classify as organism when one of these is true:

- Page-level landmark: `main`, `nav`, `header`, `footer`, major `section`, or complete `form`.
- Repeated collection with layout responsibility: card grid, workout list, tab bar, dashboard header, onboarding panel.
- Screen region that owns state, ordering, or navigation behavior.

Organisms must list molecule and atom dependencies. A full screen is not automatically an organism unless it is implemented as one reusable section.

## Consolidation Rules

- Treat each `canonical_cdd_id` as the implementation candidate.
- Treat each `duplicate_cdd_ids` entry as an instance reference or variant, not a new component.
- Exact duplicate hashes are consolidated automatically.
- Components with same role and structure but different text should be consolidated manually as variants if their visual structure matches.
- Variant names should be stable and implementation-friendly, for example `primary`, `secondary`, `compact`, `error`, `active`.
- Never generate React Native components for duplicates unless a variant changes structure or behavior.

## Workflow Checkpointing

Maintain `workflow-progress.json` as the agent memory. It must include:

- `current_state`: one of `parsed`, `classified`, `consolidated`, `ready_for_implementation`, `implemented`, `verified`.
- `source_hashes`: file hash per HTML file.
- `changed_files`: files whose hash differs from the previous run.
- `dependencies`: map of canonical component IDs to dependencies and invalidation targets.
- `components`: classification records for canonical IDs after the manager classifies them.
- `implementation_targets`: React Native component names and target paths once ready.

Delta update rules:

- If a file hash is unchanged, keep its existing classification and implementation target.
- If a file hash changed, re-read only components from that file and their dependency chain.
- If an atom changes, mark dependent molecules and organisms as `needs_regeneration`.
- If a molecule changes, mark dependent organisms as `needs_regeneration`.
- If only duplicate instance counts changed, update references but keep the canonical implementation.
- If a canonical component disappears, mark it as `removed` and mark dependents as `blocked` until remapped.

## Output Contract For Implementation Agents

After classification, produce or update `cdd-output/deduplicated-components.json` with compact records:

```json
{
  "canonical_cdd_id": "mol-card-001",
  "component_name": "WorkoutCard",
  "classification": "molecule",
  "source_file": "overview/overview.html",
  "duplicate_cdd_ids": ["mol-card-002"],
  "dependencies": ["atm-text-001", "atm-btn-001"],
  "react_native_mapping": {
    "root": "View",
    "text": "Text",
    "actions": "Pressable"
  },
  "status": "ready_for_implementation"
}
```

Keep records concise. Smaller implementation agents should not need to open the original HTML unless a component is marked `needs_review`.
