# rosetta-template

An opinionated [Astro Starlight](https://starlight.astro.build/) template for AI-native documentation: Diátaxis-organized, schema-validated, with raw-markdown twins at `/<slug>.md` and an `/llms.txt` index any agent can read.

This is **Repo A** of the Rosetta.md system. The companion [`rosetta-plugin`](https://github.com/marincervinschi/rosetta-plugin) (Repo B) is a Claude Code plugin that writes, maintains, and queries content inside sites built from this template. You can also use it standalone.

## Quickstart

```sh
# Using the "Use this template" button on GitHub — then:
git clone https://github.com/<you>/<your-docs>.git docs
cd docs
pnpm install
pnpm dev            # http://localhost:4321
```

Or without GitHub:

```sh
pnpm dlx degit marincervinschi/rosetta-template docs
cd docs
pnpm install
pnpm dev
```

## What you get

- **Four Diátaxis sections** pre-configured: `tutorials/`, `how-to/`, `reference/`, `explanation/`.
- **Zod frontmatter schema** with a build-time check that fails if a page's `category` does not match its folder.
- **Custom components** — `<Warning />`, `<CodeTabs />`, `<ApiRef />`, and an auto-injected `<CopyMarkdownButton />` next to every H1.
- **AI-readable endpoints** — `/<slug>.md` returns the page source with frontmatter preserved; `/llms.txt` indexes every page for agent consumption.
- **Editorial theme** — cream + ink light mode, warm dark mode, Fraunces headings + Inter body + JetBrains Mono code, all self-hosted.
- **Persistent mode** — `docker compose up -d` runs the built site on port 4321.

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server with hot reload at `localhost:4321` |
| `pnpm build` | Production build to `dist/` |
| `pnpm start` | Preview the built output |
| `pnpm check` | `astro check` — TypeScript + schema validation |
| `docker compose up -d --build` | Run the built site in persistent mode |

## Writing docs

The authoritative rules for content — folder layout, frontmatter, component usage, writing style, forbidden patterns — live in [`agent-docs-rules.md`](./agent-docs-rules.md). Both humans and the Rosetta plugin read from the same file.

## Versioning

The contract surface (folder layout, Zod schema, endpoint shapes, `agent-docs-rules.md` location) is governed by semver. A plugin release declares its minimum compatible template version; breaking changes to any of the above bump the template's major version.

## License

MIT.
