import { promises as fs } from 'node:fs';
import path from 'node:path';

const DOCS_DIR = 'src/content/docs';
const KNOWN_CATEGORIES = ['tutorials', 'how-to', 'reference', 'explanation'];

/**
 * Astro integration: at build start and dev-server start, walk
 * src/content/docs/** and fail if any page's `category` frontmatter
 * does not match the folder it lives in. Pages at the collection
 * root (no parent folder) are exempt — they are reserved for the
 * splash/landing page.
 *
 * @returns {import('astro').AstroIntegration}
 */
export function checkCategory() {
	return {
		name: 'rosetta:check-category',
		hooks: {
			'astro:build:start': async ({ logger }) => validate(logger),
			'astro:server:setup': async ({ logger }) => validate(logger),
		},
	};
}

async function validate(logger) {
	const root = path.resolve(DOCS_DIR);
	const errors = [];
	for await (const file of walk(root)) {
		if (!/\.(md|mdx)$/.test(file)) continue;
		const rel = path.relative(root, file);
		const segments = rel.split(path.sep);
		if (segments.length < 2) continue; // splash / landing at collection root
		const folder = segments[0];
		if (!KNOWN_CATEGORIES.includes(folder)) {
			errors.push(
				`${rel}: page lives under unknown folder '${folder}'. ` +
					`Move it into one of: ${KNOWN_CATEGORIES.join(', ')}.`,
			);
			continue;
		}
		const raw = await fs.readFile(file, 'utf8');
		const fm = readFrontmatter(raw);
		if (!('category' in fm)) {
			errors.push(
				`${rel}: missing 'category' frontmatter (expected '${folder}').`,
			);
		} else if (fm.category !== folder) {
			errors.push(
				`${rel}: category='${fm.category}' does not match folder '${folder}'.`,
			);
		}
	}
	if (errors.length) {
		for (const e of errors) logger.error(e);
		throw new Error(
			`rosetta:check-category failed with ${errors.length} error(s)`,
		);
	}
}

async function* walk(dir) {
	const entries = await fs.readdir(dir, { withFileTypes: true });
	for (const entry of entries) {
		const p = path.join(dir, entry.name);
		if (entry.isDirectory()) yield* walk(p);
		else yield p;
	}
}

function readFrontmatter(raw) {
	const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!m) return {};
	const out = {};
	for (const line of m[1].split(/\r?\n/)) {
		const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
		if (!kv) continue;
		const value = kv[2].trim().replace(/^["']|["']$/g, '');
		out[kv[1]] = value;
	}
	return out;
}
