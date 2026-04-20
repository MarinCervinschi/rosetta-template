import { visit } from 'unist-util-visit';

/**
 * Remark plugin: transforms fenced ```mermaid code blocks into
 * client-rendered diagram containers. Runs at the remark (mdast)
 * stage — before Expressive Code / Shiki — so mermaid blocks are
 * never syntax-highlighted as plain code.
 */
export function remarkMermaid() {
	return (tree) => {
		let hasMermaid = false;

		visit(tree, 'code', (node, index, parent) => {
			if (node.lang !== 'mermaid' || index === undefined || !parent) return;

			hasMermaid = true;

			const escaped = node.value
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;');

			parent.children[index] = {
				type: 'html',
				value: `<div class="rosetta-mermaid" data-source="${escaped}"></div>`,
			};
		});

		if (hasMermaid) {
			tree.children.push({
				type: 'html',
				value: `<script type="module">
import { initMermaid } from '/src/components/mermaid-renderer.ts';
initMermaid();
document.addEventListener('astro:page-load', () => initMermaid());
</script>`,
			});
		}
	};
}
