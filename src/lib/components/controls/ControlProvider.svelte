<script lang="ts">
	import type { IControl, Map } from 'mapbox-gl'
	import type { ComponentType } from 'svelte'
	import type { Writable } from 'svelte/store'

	import { getContext, onMount } from 'svelte'

	class CustomControl implements IControl {
		#target?: HTMLElement
		#Component: ComponentType

		constructor(Component: ComponentType) {
			this.#Component = Component
		}
		onAdd(map: Map): HTMLElement {
			this.#target = document.createElement('div')
			new this.#Component({
				target: this.#target,
				props: { map },
			})

			return this.#target
		}
		onRemove(): void {
			this.#target?.remove()
		}
	}

	export let position: Parameters<Map['addControl']>[1] = 'bottom-left'
	export let component: ComponentType

	const mapStore = getContext<Writable<Map>>('mapbox-map')

	onMount(() => {
		const control = new CustomControl(component)

		$mapStore.addControl(control, position)

		return () => {
			$mapStore.removeControl(control)
		}
	})
</script>
