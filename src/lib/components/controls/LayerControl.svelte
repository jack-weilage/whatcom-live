<script lang="ts">
	import { fly } from 'svelte/transition'
	import { outclick } from '$lib/actions'

	import { wsdotAlerts, wsdotBorderCrossings, wsdotCameras } from '$lib/stores/wsdot'
	import { wtaRoutes, wtaVehicles } from '$lib/stores/wta'

	import BusIcon from '$lib/img/BusIcon.svg'
	import CameraIcon from '$lib/img/CameraIcon.svg'
	import GateIcon from '$lib/img/GateIcon.svg'
	import PathIcon from '$lib/img/PathIcon.svg'
	import WarningIcon from '$lib/img/WarningIcon.svg'

	import MenuIcon from 'lucide-svelte/icons/menu'
	import XIcon from 'lucide-svelte/icons/x'

	$: layers = [
		{
			name: 'WTA Vehicles',
			src: BusIcon,
			visible: $wtaVehicles.visible,
			store: wtaVehicles,
		},
		{
			name: 'WTA Routes',
			src: PathIcon,
			visible: $wtaRoutes.visible,
			store: wtaRoutes,
		},
		{
			name: 'WSDOT Border Crossings',
			src: GateIcon,
			visible: $wsdotBorderCrossings.visible,
			store: wsdotBorderCrossings,
		},
		{
			name: 'WSDOT Alerts',
			src: WarningIcon,
			visible: $wsdotAlerts.visible,
			store: wsdotAlerts,
		},
		{
			name: 'WSDOT Cameras',
			src: CameraIcon,
			visible: $wsdotCameras.visible,
			store: wsdotCameras,
		},
	]
	let open = false
</script>

<div class="flex flex-wrap gap-2" use:outclick={() => (open = false)}>
	<label
		class:bg-gray-100={!open}
		class:text-gray-400={!open}
		class="mr-10 flex aspect-square cursor-pointer items-center rounded-full bg-white px-2 py-1.5"
	>
		<input type="checkbox" class="hidden cursor-pointer" bind:checked={open} />
		{#if open}
			<XIcon color="#000" aria-label="Close layer toggle menu" />
		{:else}
			<MenuIcon color="#000" aria-label="Open layer toggle menu" />
		{/if}
	</label>

	{#if open}
		<div class="mr-16 flex flex-wrap gap-2" transition:fly={{ x: -50, duration: 250 }}>
			{#each layers as { name, visible, store, src } (name)}
				<label
					class:bg-gray-100={!visible}
					class:text-gray-400={!visible}
					class="flex cursor-pointer items-center rounded-full bg-white px-2 py-1.5 transition-colors"
				>
					<input
						type="checkbox"
						checked={visible}
						class="hidden cursor-pointer"
						on:change={async ({ currentTarget }) => {
							currentTarget.checked ? await store.show() : store.hide()
						}}
					/>
					<img {src} alt="" class="mr-2 size-5" />
					{name}
				</label>
			{/each}
		</div>
	{/if}
</div>
