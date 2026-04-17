/**
 * /<slug>.md — raw-Markdown twin of every docs page.
 *
 * Returns the page's source file verbatim with frontmatter preserved,
 * so agents reading the page get the same title/description/category
 * metadata a build-time reader would. Also powers the
 * <CopyMarkdownButton/>'s clipboard fetch.
 */

import { promises as fs } from 'node:fs';
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';

/**
 * Map a content-collection entry id to the URL slug that powers
 * /<slug>.md. Folder-index entries lose their `/index` suffix so
 * the /tutorials/ page lives at /tutorials.md (not
 * /tutorials/index.md), matching how Starlight serves the HTML page.
 */
function toMdSlug(entryId: string): string {
	if (entryId === 'index') return 'index';
	if (entryId.endsWith('/index'))
		return entryId.slice(0, -'/index'.length);
	return entryId;
}

export const getStaticPaths: GetStaticPaths = async () => {
	const docs = await getCollection('docs');
	return docs.map((entry) => ({
		params: { slug: toMdSlug(entry.id) },
		props: { entry },
	}));
};

export const GET: APIRoute = async ({ props }) => {
	const { entry } = props as { entry: Awaited<ReturnType<typeof getCollection<'docs'>>>[number] };
	const filePath = entry.filePath;

	if (!filePath) {
		return new Response(`Missing filePath for entry ${entry.id}`, {
			status: 500,
		});
	}

	const raw = await fs.readFile(filePath, 'utf-8');

	return new Response(raw, {
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
		},
	});
};
