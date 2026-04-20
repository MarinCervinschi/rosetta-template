/**
 * Client-side Mermaid rendering engine.
 *
 * Shared by the <Mermaid> Astro component and the remark-mermaid plugin.
 * Lazy-loads the mermaid library on first use, watches for theme changes
 * via MutationObserver, and re-renders diagrams when the theme toggles.
 */

let initialized = false;

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

function isDark(): boolean {
	return document.documentElement.dataset.theme === 'dark';
}

async function renderAll() {
	const { default: mermaid } = await import('mermaid');

	mermaid.initialize({
		startOnLoad: false,
		theme: isDark() ? 'dark' : 'default',
		fontFamily: 'var(--sl-font)',
	});

	const containers =
		document.querySelectorAll<HTMLElement>('.rosetta-mermaid');

	for (const el of containers) {
		const source = el.dataset.source ?? el.querySelector('.rosetta-mermaid__fallback code')?.textContent;
		if (!source) continue;

		const id = `mermaid-${crypto.randomUUID().slice(0, 8)}`;

		try {
			const { svg } = await mermaid.render(id, source);
			el.innerHTML = svg;
			el.classList.add('rosetta-mermaid--rendered');
			el.classList.remove('rosetta-mermaid--error');
		} catch (err) {
			el.innerHTML = `<div class="rosetta-mermaid__error">
				<strong>Mermaid syntax error</strong>
				<pre>${escapeHtml(String(err))}</pre>
				<details><summary>Source</summary><pre>${escapeHtml(source)}</pre></details>
			</div>`;
			el.classList.add('rosetta-mermaid--error');
			el.classList.remove('rosetta-mermaid--rendered');
			// Clean up the temporary container mermaid may have injected
			document.querySelector(`#d${id}`)?.remove();
		}
	}
}

function observeTheme() {
	const observer = new MutationObserver((mutations) => {
		for (const m of mutations) {
			if (m.attributeName === 'data-theme') {
				renderAll();
				break;
			}
		}
	});
	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ['data-theme'],
	});
}

export function initMermaid() {
	if (initialized) {
		// Re-render in case new elements appeared (view transitions)
		renderAll();
		return;
	}
	initialized = true;
	renderAll();
	observeTheme();
}
