import type { Action } from 'svelte/action'

export const outclick: Action<HTMLElement, () => void> = (node, callback) => {
	function onClick({ target }: MouseEvent) {
		if (!node.contains(target!)) {
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
