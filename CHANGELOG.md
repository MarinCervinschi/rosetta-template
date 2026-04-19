# Changelog

All notable changes to `rosetta-template` are recorded here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); the project adheres to [Semver](https://semver.org/) with the `0.x` convention that contract-surface breaks bump the minor version (from `1.0.0` onwards they will bump the major).

## [Unreleased]

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

[Unreleased]: https://github.com/MarinCervinschi/rosetta-template/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/MarinCervinschi/rosetta-template/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/MarinCervinschi/rosetta-template/releases/tag/v0.1.0
