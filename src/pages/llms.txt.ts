/**
 * /llms.txt — a machine-readable index of every docs page.
 *
 * Follows the llmstxt.org convention: a top-level title, a short
 * description, and grouped links to individual pages. Consumers (the
 * Rosetta plugin, other agents) fetch this single file to enumerate
 * the site, then fetch the per-page .md twin for the page they need.
 */

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SECTION_TITLES: Record<string, string> = {
	tutorials: 'Tutorials',
	'how-to': 'How-to guides',
	reference: 'Reference',
	explanation: 'Explanation',
};

const SECTION_IDS = Object.keys(SECTION_TITLES);

function docUrl(entryId: string): string {
	if (entryId === 'index') return '/';
	if (entryId.endsWith('/index'))
		return `/${entryId.slice(0, -'/index'.length)}/`;
	return `/${entryId}/`;
}

function sectionOf(entryId: string): string {
	if (entryId === 'index' || entryId === '') return 'Home';
	if (SECTION_IDS.includes(entryId)) return entryId;
	if (entryId.includes('/')) return entryId.split('/')[0];
	return 'Home';
}

export const GET: APIRoute = async ({ site }) => {
	const docs = await getCollection('docs');
	const base = site?.toString().replace(/\/$/, '') ?? '';

	const bySection = new Map<string, typeof docs>();
	for (const entry of docs) {
		const s = sectionOf(entry.id);
		if (!bySection.has(s)) bySection.set(s, []);
		bySection.get(s)!.push(entry);
	}

	const preferredOrder = [
		'Home',
		'tutorials',
		'how-to',
		'reference',
		'explanation',
	];
	const sections = [...bySection.keys()].sort(
		(a, b) => preferredOrder.indexOf(a) - preferredOrder.indexOf(b),
	);

	const lines: string[] = [];
	lines.push('# Rosetta.md');
	lines.push('');
	lines.push(
		'> An AI-native documentation baseline: Astro Starlight plus raw-markdown twins at `<slug>.md`, organized into the four Diátaxis categories.',
	);
	lines.push('');

	for (const section of sections) {
		const entries = bySection
			.get(section)!
			.sort((a, b) => a.id.localeCompare(b.id));
		const title = SECTION_TITLES[section] ?? section;
		lines.push(`## ${title}`);
		lines.push('');
		for (const entry of entries) {
			const url = base + docUrl(entry.id);
			const desc = entry.data.description ?? '';
			lines.push(`- [${entry.data.title}](${url}): ${desc}`);
		}
		lines.push('');
	}

	return new Response(lines.join('\n'), {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
		},
	});
};
