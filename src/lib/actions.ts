import type { ActionReturn } from 'svelte/action'

export const outclick = (node: Node, callback: () => void): ActionReturn<() => void> => {
	function onClick({ target }: MouseEvent) {
		if (!node.contains(target as Node)) {
			callback()
		}
	}
	window.addEventListener('click', onClick)

	return {
		destroy() {
			window.removeEventListener('click', onClick)
		},
	}
}
