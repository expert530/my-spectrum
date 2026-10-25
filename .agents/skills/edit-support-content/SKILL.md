---
name: edit-support-content
description: Add, edit, reorder or remove the support content My Spectrum shows to users, including parent/teacher strategies in src/lib/recommendations.ts, external resource links in src/data/resources.ts, and the 0–5 score descriptions in src/data/allSettingValues.json. Use for wording fixes, new evidence-based strategies, broken or outdated links, or a new strategy source. Do not use for adding or renaming metrics, because that changes the share-URL contract.
---

# Edit support content

This content is shown to parents and teachers of neurodivergent people. Keep it accurate,
neutral, sourced and neurodiversity-affirming. Do not invent sources or citations. If you can't
attribute a strategy to an existing source, ask the user before adding it.

## Strategies — `src/lib/recommendations.ts`

- `supportStrategies` is a `StrategyMap` with 6 metrics × `parent`/`teacher` ×
  `highNeed`/`moderate`/`independent`. Each level holds three entries of the form
  `s('text', 'CHADD' | 'Understood' | 'ASAN')`.
- **Order matters:** `generateRecommendations` only shows the **first 2** strategies per
  metric/audience/level, for the 3 lowest-scoring metrics. A third or later entry is never
  displayed. Put new strategies in the first two slots if they should be visible.
- Score bands are 0–1 → `highNeed`, 2–3 → `moderate`, and 4–5 → `independent` (`getScoreLevel`).
- Strategies are deduplicated by exact text, so identical text in two places appears once.
- Keep the text to one plain sentence, with no HTML and no blank lines (tests enforce this).
- **New source:** extend `StrategySource` in `src/types/index.ts`, then update
  `getSourceColor` and `getSourceFullName` plus the source-explanation text in both
  `src/components/SupportStrategiesSection.tsx` and `src/components/ViewingMode.tsx`. Also
  update the "Sources" header comment in `recommendations.ts`. Do not add a source without the
  user's approval.

## Resources — `src/data/resources.ts`

- `parentResources` and `teacherResources` are `Resource[]` with the fields `title`, `url` and
  `description`. Use full `https://` URLs from reputable organisations. `getRelevantResources`
  currently returns every resource without filtering.
- Fetching a URL to check it is a live network call. Only do it if the user asks, and never
  add tracking parameters.

## Score descriptions — `src/data/allSettingValues.json`

- Each metric key holds exactly six `{ "score": n, "description": "..." }` objects, ordered by
  score from 0 to 5. CSV and plaintext export (`src/lib/sharing.ts`) look up a description by
  **array index**, so never reorder entries or skip a score.
- Metric keys must match `MetricName` exactly. Do not rename them here; see `AGENTS.md`.

## Verify

```bash
npx vitest run src/__tests__/lib/recommendations.test.ts src/__tests__/data/resources.test.ts \
  src/__tests__/lib/sharing.test.ts src/__tests__/components/SupportStrategiesSection.test.tsx
npx prettier --write <changed files>
```

Then run the full gate from the [verify-change](../verify-change/SKILL.md) skill. Summarise
the user-visible wording changes in your report so a human can review the tone and accuracy.
