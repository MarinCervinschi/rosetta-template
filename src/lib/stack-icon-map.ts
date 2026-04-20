// Maps a free-form stack value (what `personalize-docs` writes into
// rosetta.config.json — e.g. "Next.js", "postgres") to a simple-icons slug.
// The slug is the filename (minus `.svg`) of the icon under
// `node_modules/simple-icons/icons/`. Returns null for unknown entries so the
// caller can render a text-chip fallback.

const MAP: Record<string, string> = {
	// Languages
	typescript: 'typescript',
	ts: 'typescript',
	javascript: 'javascript',
	js: 'javascript',
	python: 'python',
	py: 'python',
	go: 'go',
	golang: 'go',
	rust: 'rust',
	rs: 'rust',
	java: 'openjdk',
	kotlin: 'kotlin',
	ruby: 'ruby',
	php: 'php',
	csharp: 'dotnet',
	'c#': 'dotnet',
	dotnet: 'dotnet',
	swift: 'swift',
	elixir: 'elixir',

	// Frameworks
	next: 'nextdotjs',
	nextjs: 'nextdotjs',
	'next.js': 'nextdotjs',
	nuxt: 'nuxtdotjs',
	'nuxt.js': 'nuxtdotjs',
	astro: 'astro',
	react: 'react',
	vue: 'vuedotjs',
	'vue.js': 'vuedotjs',
	svelte: 'svelte',
	sveltekit: 'svelte',
	solid: 'solid',
	solidjs: 'solid',
	angular: 'angular',
	nest: 'nestjs',
	nestjs: 'nestjs',
	express: 'express',
	fastify: 'fastify',
	django: 'django',
	flask: 'flask',
	fastapi: 'fastapi',
	rails: 'rubyonrails',
	'ruby on rails': 'rubyonrails',
	laravel: 'laravel',
	spring: 'spring',
	'spring boot': 'spring',
	phoenix: 'phoenixframework',
	remix: 'remix',

	// Databases
	postgres: 'postgresql',
	postgresql: 'postgresql',
	mysql: 'mysql',
	mariadb: 'mariadb',
	sqlite: 'sqlite',
	mongodb: 'mongodb',
	mongo: 'mongodb',
	redis: 'redis',
	supabase: 'supabase',
	firebase: 'firebase',
	dynamodb: 'amazondynamodb',
	cassandra: 'apachecassandra',
	elasticsearch: 'elasticsearch',

	// ORMs
	prisma: 'prisma',
	drizzle: 'drizzle',
	typeorm: 'typeorm',
	sequelize: 'sequelize',
	mongoose: 'mongoose',
	sqlalchemy: 'sqlalchemy',

	// Deploy targets
	vercel: 'vercel',
	netlify: 'netlify',
	cloudflare: 'cloudflare',
	'cloudflare pages': 'cloudflarepages',
	'cloudflare workers': 'cloudflareworkers',
	aws: 'amazonwebservices',
	'amazon web services': 'amazonwebservices',
	gcp: 'googlecloud',
	'google cloud': 'googlecloud',
	azure: 'microsoftazure',
	docker: 'docker',
	kubernetes: 'kubernetes',
	k8s: 'kubernetes',
	fly: 'flydotio',
	'fly.io': 'flydotio',
	railway: 'railway',
	render: 'render',
	heroku: 'heroku',
};

export function normalize(value: string): string {
	return value.trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');
}

export function lookupStackSlug(value: string | null | undefined): string | null {
	if (!value) return null;
	const key = normalize(value);
	return MAP[key] ?? null;
}
