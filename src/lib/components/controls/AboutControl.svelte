<script lang="ts">
	import { HelpCircle } from 'lucide-svelte'

	let dialogRef: HTMLDialogElement

	function openDialog() {
		dialogRef.showModal()
	}
	function closeDialog() {
		dialogRef.close()
	}
</script>

<div class="mapboxgl-ctrl aspect-square overflow-hidden rounded-full bg-white">
	<button type="button" class="block h-full w-full p-1" on:click={openDialog}>
		<HelpCircle aria-label="Open about menu" />
	</button>
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions a11y-click-events-have-key-events -->
	<dialog
		class="bg-transparent backdrop:bg-black backdrop:bg-opacity-80"
		bind:this={dialogRef}
		on:click|self={closeDialog}
	>
		<div class="max-w-lg rounded-md bg-white p-6">
			<h2 class="mb-2 text-center text-3xl">whatcom.live</h2>
			<p class="mb-2">
				Bus data sourced from <a
					href="https://data.ridewta.com/api/index.html"
					class="text-blue-600">api.ridewta.com</a
				>. whatcom.live is not officially associated with or endorsed by the Whatcom Transportation
				Authority.
			</p>
			<p class="mb-2">
				Traffic alert and border crossing data sourced from <a
					href="https://www.wsdot.wa.gov/traffic/api/"
					class="text-blue-600">www.wsdot.wa.gov/traffic/api/</a
				>. whatcom.live is not officially associated with or endorsed by the Washington State
				Department of Transportation.
			</p>

			<button
				type="button"
				class="mt-8 block w-full rounded-md bg-black p-2 text-base text-white"
				on:click={closeDialog}>Close</button
			>
		</div>
	</dialog>
</div>
