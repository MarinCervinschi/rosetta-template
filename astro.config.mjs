// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { checkCategory } from './integrations/check-category.mjs';
import rosettaConfig from './src/rosetta.config.json' with { type: 'json' };

// https://astro.build/config
export default defineConfig({
	integrations: [
		checkCategory(),
		starlight({
			// Title + description are driven by ./src/rosetta.config.json so the
			// rosetta-plugin's /rosetta:personalize-docs skill can update them
			// without editing this file. Defaults fall back to the template's
			// own identity.
			title: rosettaConfig.name,
			description: rosettaConfig.tagline,
			customCss: ['./src/styles/rosetta.css'],
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
