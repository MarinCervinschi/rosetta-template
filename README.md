# rosetta-template

An opinionated [Astro Starlight](https://starlight.astro.build/) template for AI-native documentation: Diátaxis-organized, schema-validated, with raw-markdown twins at `/<slug>.md`, an `/llms.txt` index any agent can read, and a `/health` readiness probe.

This is **Repo A** of the Rosetta.md system. The companion [`rosetta-plugin`](https://github.com/MarinCervinschi/rosetta-plugin) (Repo B) is a Claude Code plugin that writes, maintains, and queries content inside sites built from this template. You can also use it standalone.

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

## What you get

- **Four Diátaxis sections** pre-configured: `tutorials/`, `how-to/`, `reference/`, `explanation/`.
- **Zod frontmatter schema** with a build-time check that fails if a page's `category` does not match its folder.
- **Custom components** — `<Warning />`, `<CodeTabs />`, `<ApiRef />`, and an auto-injected `<CopyMarkdownButton />` next to every H1.
- **AI-readable endpoints** — `/<slug>.md` returns the page source with frontmatter preserved; `/llms.txt` indexes every page for agent consumption; `/health` returns `{"status":"ok","service":"rosetta","version":"<n>"}` for readiness probes.
- **Editorial theme** — cream + ink light mode, warm dark mode, Fraunces headings + Inter body + JetBrains Mono code, all self-hosted. Cards, pagination, and code blocks now carry a subtle elevation; sidebar entries mark the current page with a left-edge accent.
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

The contract surface (folder layout, Zod schema, endpoint shapes, `agent-docs-rules.md` location) is governed by semver. A plugin release declares its minimum compatible template version; breaking changes to any of the above bump the template's major version.

### Upgrading from v0.1.0 → v0.2.0

Breaking:

- The **recommended directory name for the cloned template changed from `docs/` to `rosetta-docs/`**. Existing v0.1.0 installations at `docs/` keep working — nothing inside the template hardcodes the directory name. But the rosetta-plugin's `init-docs`, `write-docs`, and `query-docs` skills now look for `rosetta-docs/`. To migrate: `mv docs rosetta-docs`, then re-point any of your own scripts or CI.

Additive:

- `/health` endpoint added.
- `@astrojs/check` and `typescript` are now declared as devDependencies so `pnpm check` works on a fresh clone without manually installing them.
- `npm` is now a supported (if non-preferred) package manager.
- UI polish: pagination buttons, cards, and code blocks gain soft elevation; active sidebar entry now has a left-edge accent.

## License

MIT.
