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

Edit `src/rosetta.config.json`. It drives the site title and splash:

```json
{
  "name": "My Project",
  "tagline": "A one-liner for the subtitle.",
  "description": "A longer one-sentence description."
}
```

`astro.config.mjs` and `src/content/docs/index.mdx` read from this file — you don't touch them.

Or let [`rosetta-plugin`](https://github.com/MarinCervinschi/rosetta-plugin) populate it automatically via `/rosetta:personalize-docs`.

## What you get

- Four Diátaxis sections: `tutorials/`, `how-to/`, `reference/`, `explanation/`.
- Zod frontmatter schema validated at build time.
- Custom components: `<Warning />`, `<CodeTabs />`, `<ApiRef />`, auto-injected `<CopyMarkdownButton />`.
- Endpoints: `GET /<slug>.md`, `GET /llms.txt`, `GET /health`.
- Editorial theme with soft elevation, light + dark modes, self-hosted fonts.
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
