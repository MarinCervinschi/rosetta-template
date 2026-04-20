// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { checkCategory } from './integrations/check-category.mjs';
import { remarkMermaid } from './integrations/remark-mermaid.mjs';
import rawConfig from './src/rosetta.config.json' with { type: 'json' };

/** @type {import('./src/types/rosetta-config').RosettaConfig} */
const rosettaConfig = rawConfig;

const social = rosettaConfig.repoUrl
	? [{ icon: /** @type {const} */ ('github'), label: 'GitHub', href: rosettaConfig.repoUrl }]
	: undefined;

const logo = rosettaConfig.logo
	? typeof rosettaConfig.logo === 'string'
		? { src: rosettaConfig.logo, replacesTitle: false }
		: { ...rosettaConfig.logo, replacesTitle: false }
	: undefined;

// https://astro.build/config
export default defineConfig({
	markdown: {
		remarkPlugins: [remarkMermaid],
	},
	integrations: [
		checkCategory(),
		starlight({
			// Title, description, logo, and social links are driven by
			// ./src/rosetta.config.json so the rosetta-plugin's
			// /rosetta:personalize-docs skill can update them without editing this
			// file. Defaults fall back to the template's own identity.
			title: rosettaConfig.name,
			description: rosettaConfig.tagline,
			logo,
			social,
			customCss: ['./src/styles/rosetta.css'],
			components: {
				PageTitle: './src/components/overrides/PageTitle.astro',
				ThemeSelect: './src/components/overrides/ThemeToggle.astro',
				Footer: './src/components/overrides/Footer.astro',
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
