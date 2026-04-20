# rosetta-template

Opinionated [Astro Starlight](https://starlight.astro.build/) template for AI-native documentation. Diátaxis-organized, schema-validated, with raw-markdown twins at `/<slug>.md`, an `/llms.txt` index, and a `/health` readiness probe.

Works standalone. Pairs with [`rosetta-plugin`](https://github.com/MarinCervinschi/rosetta-plugin) for Claude Code automation.

## Quickstart

Click "Use this template" on GitHub to create your own repo. Then:

```sh
git clone https://github.com/<you>/<your-docs>.git rosetta-docs
```

```sh
cd rosetta-docs
pnpm install
pnpm dev
```

Open http://localhost:4321.

npm works too — `npm install` and `npm run dev`. pnpm is recommended for lockfile reproducibility.

## Rebrand

The config file is intentionally narrow — only identity and wiring lives there. Prose (description, stack, anything else) is written directly on the landing page as plain MDX.

Edit `src/rosetta.config.json`:

```json
{
  "name": "My Project",
  "tagline": "A one-liner for the subtitle.",
  "repoUrl": "https://github.com/me/my-project",
  "logo": { "light": "./src/assets/favicon.svg", "dark": "./src/assets/favicon-dark.svg" }
}
```

- `name` / `tagline` drive the header title and hero.
- `repoUrl` adds a GitHub icon to the header and a "View on GitHub" link on the landing page. Set to `null` to hide.
- `logo` accepts either a single path or a `{ light, dark }` pair for per-theme variants. Set to `null` to render text only.

For the project description, the stack list, and any other landing-page content, edit `src/content/docs/index.mdx` directly — the `## Stack` bullets use the `<StackIcon name="..." />` component for brand icons.

Or let [`rosetta-plugin`](https://github.com/MarinCervinschi/rosetta-plugin) populate both files automatically via `/rosetta:personalize-docs`.

## What you get

- Four Diátaxis sections: `tutorials/`, `how-to/`, `reference/`, `explanation/`.
- Zod frontmatter schema validated at build time.
- Custom components: `<Warning />`, `<CodeTabs />`, `<ApiRef />`, `<Mermaid />`, auto-injected `<CopyMarkdownButton />`.
- Mermaid diagrams: fenced ` ```mermaid ` blocks auto-render; or use `<Mermaid chart="..." />` explicitly. Client-side rendered, theme-aware.
- Endpoints: `GET /<slug>.md`, `GET /llms.txt`, `GET /health`.
- Editorial theme with soft elevation, light/dark toggle, self-hosted fonts.
- Footer credit link to `rosetta-template` — suppress with `"showTemplateCredit": false` in `rosetta.config.json`.
- Docker compose for persistent mode.

## Commands

| Command | Purpose |
|---|---|
| `pnpm dev` | Dev server at localhost:4321 |
| `pnpm build` | Production build |
| `pnpm check` | Schema + TypeScript validation |
| `docker compose up -d --build` | Persistent mode (always-on) |

Swap `pnpm` for `npm run` if you're using npm.

## Endpoints

| Endpoint | Returns |
|---|---|
| `GET /` | Splash page |
| `GET /<section>/[...slug]/` | HTML page |
| `GET /<section>/[...slug].md` | Raw Markdown (frontmatter preserved) |
| `GET /llms.txt` | [llmstxt.org](https://llmstxt.org/) index of every page |
| `GET /health` | `{"status":"ok","service":"rosetta","version":"<n>"}` |

## Writing docs

Rules — folder layout, frontmatter, components, style, forbidden patterns — live in [`agent-docs-rules.md`](./agent-docs-rules.md). Both humans and the `rosetta-plugin` read from the same file.

## Release history

See [`CHANGELOG.md`](./CHANGELOG.md).

## License

MIT.
