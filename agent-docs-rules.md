# Rosetta.md — Agent Rules

This file is the **canonical contract** between a Rosetta-powered documentation site and any agent that writes or edits its content. When the `rosetta-plugin` skills encounter ambiguity, they re-read this file rather than guess.

The rules are opinionated on purpose. Fewer knobs means fewer decisions the agent can get wrong.

---

## 1. Directory layout

Every page lives under `src/content/docs/` in exactly one of four folders:

```
src/content/docs/
├── index.mdx          ← splash / landing page (root only)
├── tutorials/         ← learning-oriented
├── how-to/            ← problem-oriented
├── reference/         ← information-oriented
└── explanation/       ← understanding-oriented
```

- The four folders are the **only** valid sections. Do not create new top-level folders under `docs/` without updating this file and the Zod schema.
- Within a section, folders are permitted for sub-grouping: `src/content/docs/how-to/deploy/vercel.mdx` is fine.
- Assets referenced by a page live alongside the page: `src/content/docs/tutorials/getting-started/screenshot.png`.

---

## 2. Frontmatter schema

Every `.md` and `.mdx` file must open with a YAML frontmatter block. The schema is defined in `src/content.config.ts` and enforced at build time.

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | yes | Shown in `<h1>`, page nav, and `/llms.txt` index |
| `description` | string | yes | One sentence; shown in `<meta description>` and `/llms.txt`. Non-empty |
| `category` | enum | yes (not on root splash) | One of `tutorials`, `how-to`, `reference`, `explanation`. **Must match the parent folder name**. The build fails on mismatch |
| `last_updated` | date | no | ISO-8601. If omitted, file mtime is used |
| `sidebar` | Starlight sidebar object | no | See Starlight's frontmatter reference |

### Worked examples

A tutorial:

```mdx
---
title: Your first Rosetta page
description: Create, validate, and preview a new docs page in under five minutes.
category: tutorials
---

By the end of this tutorial you will have added a new page to the
site and seen it live on localhost:4321.

## Before you begin
...
```

A how-to guide:

```mdx
---
title: How to deploy to Vercel
description: Production deployment of a Rosetta site on Vercel with a custom domain.
category: how-to
last_updated: 2026-04-17
---

This guide assumes you have a Vercel account and a Rosetta site
already running locally.

1. ...
```

A reference page:

```mdx
---
title: Frontmatter schema
description: Every field accepted by the Rosetta content collection, with types and defaults.
category: reference
---

import ApiRef from '~/components/ApiRef.astro';

| Field | Type | Default |
|---|---|---|
| `title` | string | — |
| `description` | string | — |
...
```

---

## 3. Component usage

Four custom components are shipped at `src/components/`. Import with the `~/` alias:

```mdx
import Warning from '~/components/Warning.astro';
import CodeTabs from '~/components/CodeTabs.astro';
import ApiRef from '~/components/ApiRef.astro';
import { TabItem } from '@astrojs/starlight/components';
```

**`<Warning />`** — a branded callout. Three variants via the `type` prop: `caution` (default, teal), `info` (blue), `danger` (red). Use it when the reader will hurt themselves or the system if they ignore the message. For merely helpful remarks, prefer plain prose.

```mdx
<Warning type="danger" title="Destructive">
	`pnpm astro build` overwrites `dist/` — commit first.
</Warning>
```

**`<CodeTabs />`** — language-variant code blocks. Use when the same operation has meaningfully different shapes in two or more languages (e.g. Python vs TypeScript). Do not use it to show two styles of the same language.

```mdx
<CodeTabs syncKey="lang">
	<TabItem label="Python">
		```python
		...
		```
	</TabItem>
	<TabItem label="TypeScript">
		```ts
		...
		```
	</TabItem>
</CodeTabs>
```

**`<ApiRef />`** — a single API endpoint card. Use one per endpoint. Method must be one of `GET | POST | PUT | PATCH | DELETE`.

```mdx
<ApiRef
	method="POST"
	path="/api/v1/users"
	description="Create a new user."
	schemaLabel="UserCreate"
	schemaHref="/reference/schemas/user-create/"
/>
```

**`<CopyMarkdownButton />`** — auto-rendered next to every page's `<h1>` via a Starlight override. Do **not** import or place it manually in page bodies.

---

## 4. Diátaxis routing

When creating a new page, answer these questions in order. The first `yes` decides the folder.

```
Is the reader a beginner who wants to produce a concrete working result by
following steps in order?
   └─ yes → tutorials/

Does the reader already know what they want and just need a specific
recipe (deploy X, integrate Y, debug Z)?
   └─ yes → how-to/

Is the page a lookup table, a type, an endpoint, a field list, or a
CLI/API surface description?
   └─ yes → reference/

Is the page answering "why is it like this?" — context, trade-offs, design
rationale, or an overview that does not teach a skill or solve a problem?
   └─ yes → explanation/

Otherwise: the page does not belong on the site as a single document. Split
it, or pick the closest fit and note the ambiguity in the page's closing
paragraph.
```

Never create a "miscellaneous", "getting started hub", or "FAQ" top-level section.

---

## 5. Writing style

- **Voice.** Second person for instructions ("you run pnpm dev"). Third person for reference ("The `title` field is required"). Never first-person plural ("we recommend") — the template has no collective speaker.
- **Sentence length.** Prefer short declarative sentences. Break long sentences at the semicolon.
- **Opinion where it earns trust.** When two paths work, pick one and say why. Hedges like *"some users prefer"* belong in an explanation page, not a how-to.
- **Examples are load-bearing.** Every reference field and every how-to step gets at least one concrete example. No "for example, ..." stubs.
- **Avoid marketing adjectives.** *simple*, *powerful*, *elegant*, *seamless* — drop them. Show the thing, don't praise it.
- **American English.** `color`, not `colour`. `behavior`, not `behaviour`.
- **Code fences.** Always include the language tag: ` ```ts ` not ` ``` `. The raw-MD endpoint and syntax highlighter both rely on it.
- **Headings are sentences.** "How to roll back a deploy", not "Rolling back deploys".

---

## 6. Forbidden patterns

These are hard rules. The plugin's skills treat them as errors, not style suggestions.

- **No raw HTML** inside `.mdx` unless it is a custom component (`<Warning>`, `<ApiRef>`, etc.) or a Starlight primitive (`<TabItem>`). No `<div class="custom">`, no inline `<table>`. Use Markdown syntax.
- **No inline `<script>` tags**. Interactive behavior lives in a component's own `<script>` block, not in page content.
- **No external CDN asset links** (`cdn.jsdelivr.net`, `unpkg.com`, …). Images go through `src/content/docs/**` or `public/`.
- **No unversioned image URLs**. If you link an external image, link to a pinned version/commit.
- **No `template: splash` on anything but the root `index.mdx`.** Section indexes and sub-pages must render the normal page chrome so `<CopyMarkdownButton />` appears.
- **No hardcoded colors** in MDX or components. Read from CSS custom properties in `src/styles/rosetta.css`. Grep for `#[0-9a-fA-F]{3,6}` in any file you edit under `src/components/`; the match count must stay zero.
- **No new top-level folders** under `src/content/docs/` besides the four Diátaxis sections.
- **No removing frontmatter fields** marked required in section 2, even on placeholder pages.
