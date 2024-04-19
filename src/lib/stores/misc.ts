// BUG: Unsure where, but somehow the routes don't get populated until vehicles are fetched for a second time
// This is pretty annoying, but only happens occasionally
import { browser } from '$app/environment'
import type { Writable } from 'svelte/store'
import { get, readable, writable } from 'svelte/store'

export function createLayerStore<T>(initial_value: T, initial_visibility: boolean, url: string) {
	const data_store = writable(initial_value)
	const { update, subscribe } = writable(
		{
			data: initial_value,
			visible: initial_visibility,
			loaded: false,
		},
		(_, update) => {
			// Don't update unless the layer is visible.
			if (!get({ subscribe }).visible || !browser) {
				return
			}

			fetch(url)
				.then((res) => res.json() as Promise<T>)
				.then((data) => {
					data_store.set(data)
					update((store) => ({ ...store, loaded: true }))
				})

			return () => {}
		},
	)
	data_store.subscribe((data) => update((store) => ({ ...store, data })))

	return {
		data_store,
		fetch(fn: (data: T) => T = (data) => data) {
			// Don't update unless the layer is visible.
			if (!get({ subscribe }).visible) {
				return
			}

			return fetch(url)
				.then((res) => res.json() as Promise<T>)
				.then((data) => {
					data_store.set(fn(data))
					update((store) => ({ ...store, loaded: true }))
				})
		},
		show() {
			update((store) => ({ ...store, visible: true }))

			if (!get({ subscribe }).loaded) {
				void this.fetch()
			}
		},
		hide() {
			update((store) => ({ ...store, visible: false }))
		},
		subscribe,
	}
}
export function createDerivedLayerStore<T, U>(
	derived_store: Writable<U>,
	deriver: (v: U) => T,
	initial_visibility: boolean,
) {
	const { update, subscribe } = writable({
		data: deriver(get(derived_store)),
		visible: initial_visibility,
	})

	derived_store.subscribe((data) => update((store) => ({ ...store, data: deriver(data) })))

	return {
		show() {
			update((store) => ({ ...store, visible: true }))
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
