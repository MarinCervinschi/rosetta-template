// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Rosetta.md',
			description:
				'AI-native documentation template — Astro Starlight + Diátaxis + raw-markdown endpoints.',
			sidebar: [
				{ label: 'Tutorials', autogenerate: { directory: 'tutorials' } },
				{ label: 'How-to guides', autogenerate: { directory: 'how-to' } },
				{ label: 'Reference', autogenerate: { directory: 'reference' } },
				{ label: 'Explanation', autogenerate: { directory: 'explanation' } },
			],
		}),
	],
});
