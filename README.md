# rosetta-template

An opinionated [Astro Starlight](https://starlight.astro.build/) template for AI-native documentation: Diátaxis-organized, schema-validated, with raw-markdown twins at `/<slug>.md`, an `/llms.txt` index any agent can read, and a `/health` readiness probe.

The template works standalone — clone it, run `pnpm dev`, write pages. It also pairs with [`rosetta-plugin`](https://github.com/MarinCervinschi/rosetta-plugin), a Claude Code plugin that automates the boring parts: scaffolding into a consumer project, populating the site's metadata, writing Diátaxis-classified pages, and querying live docs with citations.

## Quickstart

The template is designed to live under `rosetta-docs/` inside your project — a scoped directory name that won't collide with an existing `docs/` folder you may already have.

```sh
# Using the "Use this template" button on GitHub — then:
git clone https://github.com/<you>/<your-docs>.git rosetta-docs
cd rosetta-docs
pnpm install     # pnpm recommended; npm and yarn also work
pnpm dev         # http://localhost:4321
```

Or without GitHub:

```sh
pnpm dlx degit MarinCervinschi/rosetta-template rosetta-docs
cd rosetta-docs
pnpm install
pnpm dev
```

### Using npm instead of pnpm

pnpm is the package manager of record (the shipped lockfile is `pnpm-lock.yaml` and the Dockerfile uses `pnpm install --frozen-lockfile` for deterministic builds). But if you don't have pnpm, npm works too:

```sh
rm pnpm-lock.yaml        # optional — avoids mixed-lockfile warnings
npm install
npm run dev
```

Trade-offs: npm resolves the dep tree independently from the pnpm lockfile, so reproducibility across machines is weaker. For CI and deployments, stick with pnpm.

### Rebrand the site

Edit `src/rosetta.config.json` — it drives the Starlight title and description and the splash hero:

```json
{
  "name": "My Project",
  "tagline": "A one-liner for the site subtitle.",
  "description": "A longer one-sentence description for <meta>.",
  "stack": { "language": null, "framework": null, "database": null, "orm": null, "deploy": null },
  "personalized": true,
  "personalizedAt": "2026-04-19T00:00:00Z"
}
```

`astro.config.mjs` imports this file and passes `name`/`tagline` to Starlight; `src/content/docs/index.mdx` uses `{config.name}` and `{config.description}` expressions in the hero. You don't need to touch those files.

If you're using the [`rosetta-plugin`](https://github.com/MarinCervinschi/rosetta-plugin), `/rosetta:personalize-docs` detects the project's identity from `package.json` / `pyproject.toml` / `go.mod` / etc., previews the changes, and writes this JSON for you. One-shot — edit by hand afterwards.

## What you get

- **Four Diátaxis sections** pre-configured: `tutorials/`, `how-to/`, `reference/`, `explanation/`. Sub-grouping folders are allowed inside each (for example the template ships its own walkthroughs under `tutorials/meta/`, `how-to/meta/`, `reference/meta/` — visible as a "meta" sub-tree in the sidebar, separate from your project content).
- **`src/rosetta.config.json`** — single source for the site's name, tagline, description, and a small stack summary. Edit it by hand or let the `rosetta-plugin` populate it.
- **Zod frontmatter schema** with a build-time check that fails if a page's `category` does not match its folder.
- **Custom components** — `<Warning />`, `<CodeTabs />`, `<ApiRef />`, and an auto-injected `<CopyMarkdownButton />` next to every H1.
- **AI-readable endpoints** — `/<slug>.md` returns the page source with frontmatter preserved; `/llms.txt` indexes every page for agent consumption; `/health` returns `{"status":"ok","service":"rosetta","version":"<n>"}` for readiness probes.
- **Editorial theme** — cream + ink light mode, warm dark mode, Fraunces headings + Inter body + JetBrains Mono code, all self-hosted. Cards, pagination, and code blocks carry a subtle elevation; sidebar entries mark the current page with a left-edge accent.
- **Persistent mode** — `docker compose up -d` runs the built site on port 4321.

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server with hot reload at `localhost:4321` |
| `pnpm build` | Production build to `dist/` |
| `pnpm start` | Preview the built output |
| `pnpm check` | `astro check` — TypeScript + schema validation (uses bundled `@astrojs/check`) |
| `docker compose up -d --build` | Run the built site in persistent mode |

Swap `pnpm` for `npm run` if you're using npm; the scripts are identical.

## Endpoints

| Endpoint | Purpose |
|---|---|
| `GET /` | Splash / landing page |
| `GET /<section>/[...slug]/` | Standard HTML pages |
| `GET /<section>/[...slug].md` | Raw Markdown twin of each page (frontmatter preserved) |
| `GET /llms.txt` | Machine-readable index of every page ([llmstxt.org](https://llmstxt.org/) format) |
| `GET /health` | JSON readiness probe: `{"status":"ok","service":"rosetta","version":"<n>"}` |

## Writing docs

The authoritative rules for content — folder layout, frontmatter, component usage, writing style, forbidden patterns — live in [`agent-docs-rules.md`](./agent-docs-rules.md). Both humans and the Rosetta plugin read from the same file.

## Versioning

The contract surface (folder layout, Zod schema, endpoint shapes, `agent-docs-rules.md` location) is governed by semver. A plugin release declares its minimum compatible template version; while both repos are in the `0.x` series, contract-surface breaks bump the minor version (from `1.0.0` onwards they bump the major). Release notes live in [`CHANGELOG.md`](./CHANGELOG.md).

## License

MIT.
