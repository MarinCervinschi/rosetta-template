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

function readVar(name: string): string {
	return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function buildThemeVariables() {
	const accent = readVar('--sl-color-accent');
	const accentLow = readVar('--sl-color-accent-low');
	const accentHigh = readVar('--sl-color-accent-high');
	const text = readVar('--sl-color-text');
	const textAccent = readVar('--sl-color-text-accent');
	const bg = readVar('--sl-color-bg');
	const bgSidebar = readVar('--sl-color-bg-sidebar');
	const hairline = readVar('--sl-color-hairline');
	const gray2 = readVar('--sl-color-gray-2');
	const gray3 = readVar('--sl-color-gray-3');
	const gray5 = readVar('--sl-color-gray-5');
	const danger = readVar('--rosetta-callout-stripe-danger');
	const dangerBg = readVar('--rosetta-callout-bg-danger');
	const fontFamily = readVar('--sl-font') || 'system-ui, sans-serif';

	return {
		fontFamily,
		// Flowchart / generic
		primaryColor: accentLow,
		primaryTextColor: text,
		primaryBorderColor: accent,
		secondaryColor: bgSidebar,
		secondaryTextColor: text,
		secondaryBorderColor: hairline,
		tertiaryColor: bg,
		tertiaryTextColor: text,
		tertiaryBorderColor: hairline,
		lineColor: gray3,
		background: bg,
		mainBkg: accentLow,
		secondBkg: bgSidebar,
		clusterBkg: bgSidebar,
		clusterBorder: hairline,
		edgeLabelBackground: bg,
		nodeTextColor: text,
		titleColor: text,
		// Sequence
		actorBkg: accentLow,
		actorBorder: accent,
		actorTextColor: text,
		actorLineColor: gray3,
		signalColor: gray2,
		signalTextColor: text,
		labelBoxBkgColor: bgSidebar,
		labelBoxBorderColor: accent,
		labelTextColor: text,
		loopTextColor: text,
		noteBorderColor: accent,
		noteBkgColor: accentLow,
		noteTextColor: text,
		activationBorderColor: accent,
		activationBkgColor: accentLow,
		sequenceNumberColor: textAccent,
		// Gantt
		sectionBkgColor: bgSidebar,
		altSectionBkgColor: bg,
		taskBkgColor: accentLow,
		taskTextColor: text,
		taskTextOutsideColor: text,
		taskTextClickableColor: textAccent,
		activeTaskBkgColor: accent,
		activeTaskBorderColor: accentHigh,
		gridColor: hairline,
		doneTaskBkgColor: gray5,
		doneTaskBorderColor: gray3,
		critBorderColor: danger,
		critBkgColor: dangerBg,
		todayLineColor: accent,
		// State / class
		classText: text,
	};
}

async function renderAll() {
	const { default: mermaid } = await import('mermaid');

	mermaid.initialize({
		startOnLoad: false,
		theme: 'base',
		themeVariables: buildThemeVariables(),
		fontFamily: readVar('--sl-font') || undefined,
		darkMode: isDark(),
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
