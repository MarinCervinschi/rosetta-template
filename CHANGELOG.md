# Changelog

All notable changes to `rosetta-template` are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); the project adheres to [Semver](https://semver.org/) with the `0.x` convention that contract-surface breaks bump the minor version (from `1.0.0` onwards they will bump the major).

## [Unreleased]

## [0.5.0] — 2026-04-22

### Changed (contract surface — theme)

- **Body font swapped from Inter to Instrument Sans Variable.** Inter has become ubiquitous across modern dev UIs (Anthropic, GitHub, Figma, Vercel, Linear); Instrument Sans gives the template a distinctive editorial voice that pairs naturally with the existing Fraunces serif headings. `font-feature-settings` updated from Inter-specific character variants (`cv02`, `cv03`, `cv04`, `cv11`) to standard `kern`, `liga`. Consumers who overrode `--sl-font` will keep their override.
- **Surface palette desaturated.** Warm cream backgrounds (`#faf7f2` light / `#1a1816` dark) shift to neutral-warm stone tones (`#fafaf9` / `#18181a`). The sidebar, inline-code, code-block, and hairline tokens move in lockstep to the stone scale. The yellow cast is removed while keeping a whisper of warmth — not pure white, not cold. Paste-inspired restraint.
- **Elevation pulled lower.** Light-mode shadow opacity reduced ~25–30%; dark-mode inset highlight-lines reduced in kind. Cards and code blocks read as quieter containers.
- **Heading letter-spacing tightened** from `-0.015em` to `-0.02em` to match the Fraunces / Instrument Sans pairing.
- **Logo image refresh** (carried over from `e293c1d`).

### Preserved

- Accent teal (`#0f766e` light / `#5eead4` dark), callout stripe + background colors, HTTP method badge colors, Fraunces serif headings, JetBrains Mono for code.
- Spacing scale, radii, motion tokens.
- No component markup, content, or `astro.config.mjs` changes — tokens-only refresh.

## [0.4.0] — 2026-04-20

### Breaking (contract surface)

- **`rosetta.config.json` shape trimmed to essentials.** The `stack` object and `description` string are removed; presentation moves to the landing page MDX where agents and humans can edit it as plain prose. Remaining fields: `name`, `tagline`, `repoUrl`, `logo`, `showTemplateCredit`, `personalized`, `personalizedAt`. Consumers upgrading from `0.3.x` who populated `description` or `stack` in the JSON must move that content into `src/content/docs/index.mdx` (the template's `## Stack` bullet list and the opening paragraph are the two slots). The rosetta-plugin `/rosetta:personalize-docs` skill has been updated in lockstep.
- **Landing page is now the project overview.** `src/content/docs/explanation/overview.mdx` is deleted; the root route `/` renders the project identity (name, tagline, description prose, stack, Diátaxis cards, GitHub CTA). Consumers who deep-linked to `/explanation/overview/` need to update those links to `/`. The "Read the rules" pointer that previously lived on the landing moved to `src/content/docs/explanation/agent-rules.mdx`.

### Added

- **`repoUrl` field in `rosetta.config.json`.** Set once, wires a GitHub icon into the header social slot and a "View on GitHub" link on the landing page.
- **`logo` field in `rosetta.config.json`.** Accepts a single path string or Starlight's native `{ light, dark }` pair for per-theme brand variants. Template ships `favicon.svg` (dark teal for light mode) and `favicon-dark.svg` (bright teal for dark mode).
- **`<StackIcon name="..." />` component.** Renders a single inline brand icon (via `simple-icons`) for use in MDX stack bullet lists or anywhere else. Unknown brand names fall through to a small dot placeholder instead of erroring. ~80 stack-value aliases covered in `src/lib/stack-icon-map.ts`.
- **Copy-as-md toast.** Clicking the `<CopyMarkdownButton />` now shows a floating, aria-live toast in addition to the in-place icon / label swap. Success and error variants.
- **Mermaid diagram support.** Fenced ` ```mermaid ` code blocks auto-render via a remark plugin; explicit `<Mermaid chart="..." />` component also available. Client-side rendered, lazy-loaded, theme-aware (diagrams re-render on light/dark toggle). Invalid syntax shows a styled error box instead of breaking the page. Demo page at `reference/meta/mermaid`.
- **Footer credit link.** "Built with rosetta-template" with GitHub icon in the page footer, pointing to the template repo. Suppress with `"showTemplateCredit": false` in `rosetta.config.json`.
- **Light/dark toggle button** replaces Starlight's three-option theme selector. Single click switches theme; first visit follows system preference; choice persists via localStorage.
- **`simple-icons` dependency.** Source of the brand SVGs consumed by `<StackIcon />`. Read from disk at build time, not bundled — so the renderable set follows what the landing page names, with no tree-shake configuration required.
- **`src/types/rosetta-config.ts`.** TypeScript interface documenting the config shape. Not a runtime schema — the contract with personalize-docs and editor IntelliSense.

### Changed

- **Landing page `src/content/docs/index.mdx` restructured as project identity.** Hero (name + tagline) → opening description paragraph (plain MDX) → `## Stack` bullet list → Diátaxis cards → "How the baseline is enforced" section → GitHub CTA. The earlier "Read the rules" section is relocated.
- **`astro.config.mjs` conditionally wires new config surfaces.** `logo`, `social` (GitHub icon) are attached only when the corresponding config field is non-null, so a pristine template still looks like a baseline.
- **Starlight logo image sized to `1.25rem` with a tightened `--rosetta-space-2` gap from the title**, so the mark reads as inline branding rather than a dominant graphic.
- `z` import moved from deprecated `astro:content` re-export to `astro/zod` (prepares for Astro 7).

### Removed

- `description` and `stack` keys from `rosetta.config.json` (see Breaking).
- `src/content/docs/explanation/overview.mdx` — the landing page absorbs its role.
- `src/components/StackIcons.astro` — superseded by the inline `<StackIcon />` component.

## [0.3.1] — 2026-04-19

### Changed

- **README rewritten for clarity.** Tighter sections, shorter prose, each quickstart command in its own code block, drops the `pnpm dlx degit` alternate install path in favor of a single "Use this template" flow. `rosetta.config.json` explained as the rebrand surface. Ships a custom favicon. No contract-surface changes.

## [0.3.0] — 2026-04-19

Metadata becomes data. A single JSON file now drives the site's identity (title, tagline, description, stack summary), which lets the `rosetta-plugin`'s `/rosetta:personalize-docs` skill personalize a project by editing one file instead of three. The template's own demo pages move under per-section `meta/` subfolders so they stay as useful reference without cluttering a consumer's sidebar.

### Breaking (contract surface)

- **New required file: `rosetta-docs/src/rosetta.config.json`.** Stores `name`, `tagline`, `description`, `stack` (language/framework/database/orm/deploy), `personalized`, `personalizedAt`. `astro.config.mjs` reads `title` and `description` from it at build time; `src/content/docs/index.mdx` uses `{config.name}` and `{config.description}` expressions for the hero. The rosetta-plugin v0.3.1+ edits this file to personalize a project. Consumers upgrading from v0.2.0 who hand-edited `astro.config.mjs` for a custom title should move that value into this JSON.
- **Demo pages relocated to `meta/` subfolders.** `tutorials/getting-started.mdx → tutorials/meta/getting-started.mdx`, `how-to/add-a-warning.mdx → how-to/meta/add-a-warning.mdx`, `reference/components.mdx → reference/meta/components.mdx`. They remain useful as Rosetta reference but are now visually separated from consumer content in the sidebar. Cross-links between them updated. Consumers who had hand-links to the old paths need to update them.

### Added

- `rosetta-docs/src/content/docs/explanation/overview.mdx` — new placeholder page that the `rosetta-plugin` overwrites during personalization. Ships with a `<!-- rosetta:overview:placeholder -->` marker so the plugin can distinguish an unmodified placeholder from a personalized overview (idempotency guard).

### Changed

- `astro.config.mjs` imports `./src/rosetta.config.json` and uses `rosettaConfig.name` / `rosettaConfig.tagline` in `starlight({ ... })`.
- `src/content/docs/index.mdx` uses `{config.*}` expressions in the hero (eyebrow, H1, lede). The frontmatter `title` stays static (`Home`) because Zod doesn't evaluate expressions.

### Versioning

- `package.json` bumped `0.2.0 → 0.3.0`.

## [0.2.0] — 2026-04-19

### Breaking (contract surface)

- **Recommended clone target renamed from `docs/` to `rosetta-docs/`.** The scoped name avoids collisions with a pre-existing `docs/` folder in consumer projects. Nothing inside the template hardcodes the directory name, so `v0.1.0` installs at `docs/` keep working; the `rosetta-plugin` `v0.2.0` skills expect `rosetta-docs/`. Migration: `mv docs rosetta-docs` in your consumer project, then re-point any of your own scripts or CI.

### Added

- `GET /health` — JSON readiness probe returning `{"status":"ok","service":"rosetta","version":"<n>"}`. Cheap, stateless, identity-bearing: callers can distinguish the rosetta template from an unrelated service bound to `:4321`. Used by the `rosetta-plugin` skills (`init-docs`, `write-docs`, `query-docs`) in place of the heavier `/llms.txt` check.
- **Example pages** demonstrating every custom component in realistic contexts: `tutorials/getting-started`, `how-to/add-a-warning`, and `reference/components`.
- **devDependencies declared explicitly.** `@astrojs/check` and `typescript` are now shipped in `package.json`, so `pnpm check` runs on a fresh clone without the user installing them by hand. Previously they were required but absent — a bug.
- **npm supported as a package manager alongside pnpm.** `pnpm` remains the recommended baseline (the committed lockfile is `pnpm-lock.yaml` and the `Dockerfile` uses `pnpm install --frozen-lockfile`), but `npm install` / `npm run <script>` also work for consumers who prefer it. Trade-off: npm resolves the dep tree independently from the pnpm lockfile, so cross-machine reproducibility is weaker.

### Changed

- **UI — soft elevation replaces flat surfaces.** Previous/Next pagination buttons (now compact), splash cards, and code blocks carry a subtle resting shadow and lift on hover instead of sitting flat against the page. The active sidebar entry gets a left-edge accent bar for non-color cues. New `--rosetta-shadow-{sm,md,lg}` tokens (per-theme) live in `src/styles/rosetta.css`.

## [0.1.0] — 2026-04-17

### Added

- Initial release. Astro Starlight baseline with four Diátaxis sections (`tutorials/`, `how-to/`, `reference/`, `explanation/`), Zod-validated frontmatter schema in `src/content.config.ts`, custom components (`<Warning>`, `<CodeTabs>`, `<ApiRef>`, auto-injected `<CopyMarkdownButton>`), editorial theme (cream + ink light / warm dark, Fraunces + Inter + JetBrains Mono, self-hosted fonts), `GET /<slug>.md` raw-Markdown twin endpoint, `GET /llms.txt` llmstxt.org index endpoint, Dockerfile + `compose.yml` for persistent deployment, and canonical `agent-docs-rules.md` content contract.

[Unreleased]: https://github.com/MarinCervinschi/rosetta-template/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/MarinCervinschi/rosetta-template/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/MarinCervinschi/rosetta-template/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/MarinCervinschi/rosetta-template/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/MarinCervinschi/rosetta-template/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/MarinCervinschi/rosetta-template/releases/tag/v0.1.0
