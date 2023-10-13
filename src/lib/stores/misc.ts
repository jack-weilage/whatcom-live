import { get, readable, writable } from 'svelte/store'

export function createLayerStore<T>(initial_value: T, initial_visibility: boolean, url: string) {
	const { update, subscribe } = writable({
		data: initial_value,
		visible: initial_visibility,
		loaded: false,
	})

	return {
		fetch(fn: (data: T) => T = (data) => data) {
			// Don't update unless the layer is visible.
			if (!get({ subscribe }).visible) {
				return
			}

			return fetch(url)
				.then((res) => res.json() as Promise<T>)
				.then((data) => update((store) => ({ ...store, data: fn(data), loaded: true })))
		},
		async show() {
			update((store) => ({ ...store, visible: true }))

			if (!get({ subscribe }).loaded) {
				this.fetch()
			}
		},
		hide() {
			update((store) => ({ ...store, visible: false }))
		},
		subscribe,
	}
}

export const now = readable(Date.now(), (set) => {
	const interval = setInterval(() => {
		set(Date.now())
	}, 1000)

	return () => {
		clearInterval(interval)
	}
})
