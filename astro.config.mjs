// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { checkCategory } from './integrations/check-category.mjs';

// https://astro.build/config
export default defineConfig({
	integrations: [
		checkCategory(),
		starlight({
			title: 'Rosetta.md',
			description:
				'AI-native documentation template — Astro Starlight + Diátaxis + raw-markdown endpoints.',
			components: {
				PageTitle: './src/components/overrides/PageTitle.astro',
			},
			sidebar: [
				{ label: 'Tutorials', autogenerate: { directory: 'tutorials' } },
				{ label: 'How-to guides', autogenerate: { directory: 'how-to' } },
				{ label: 'Reference', autogenerate: { directory: 'reference' } },
				{ label: 'Explanation', autogenerate: { directory: 'explanation' } },
			],
		}),
	],
});
