/**
 * /health — lightweight readiness probe.
 *
 * Used by the rosetta-plugin's init-docs and write-docs skills to decide
 * whether the dev/preview server is up before reporting success. Intentionally
 * cheap: no DB call, no content scan, no network. Just "is this Astro server
 * responding" plus enough identity for the caller to distinguish it from
 * some other service that happens to be bound to port 4321.
 */

import packageJson from '../../package.json';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
	const body = JSON.stringify({
		status: 'ok',
		service: 'rosetta',
		version: packageJson.version,
	});

	return new Response(body, {
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Cache-Control': 'no-store',
		},
	});
};
