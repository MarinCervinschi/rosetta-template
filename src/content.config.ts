import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: z.object({
				// Required so every page carries a sentence the /llms.txt index
				// and the <head> <meta name="description"> both consume.
				description: z.string().min(1),
				// Diátaxis category. Values match folder names verbatim so the
				// build-time check is a literal string compare.
				category: z
					.enum(['tutorials', 'how-to', 'reference', 'explanation'])
					.optional(),
				last_updated: z.coerce.date().optional(),
			}),
		}),
	}),
};
