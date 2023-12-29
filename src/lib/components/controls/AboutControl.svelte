<script lang="ts">
	import HelpCircle from 'lucide-svelte/icons/help-circle'

	let dialogRef: HTMLDialogElement

	function openDialog() {
		dialogRef.showModal()
	}
	function closeDialog() {
		dialogRef.close()
	}
</script>

<div class="aspect-square overflow-hidden rounded-full bg-white">
	<button type="button" class="block size-full p-1" on:click={openDialog}>
		<HelpCircle aria-label="Open about menu" />
	</button>
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions a11y-click-events-have-key-events -->
	<dialog
		class="max-w-lg rounded-md p-6 backdrop:bg-black backdrop:bg-opacity-80"
		bind:this={dialogRef}
		on:click|self={closeDialog}
	>
		<h2 class="mb-2 text-center text-3xl">About</h2>
		<p class="mb-2">
			Bus data sourced from <a href="https://data.ridewta.com/api/index.html" class="text-blue-600"
				>api.ridewta.com</a
			>.
		</p>
		<p class="mb-2">
			Traffic alert and border crossing data sourced from <a
				href="https://www.wsdot.wa.gov/traffic/api/"
				class="text-blue-600">wsdot.wa.gov/traffic/api/</a
			>.
		</p>
		<p class="mb-2">
			whatcom.live is an open-source project, run by <a
				href="https://weilage.dev"
				class="text-blue-600">Jack Weilage</a
			>. If you want to see how this website was made, visit
			<a href="https://github.com/jack-weilage/whatcom-live" class="text-blue-600"
				>github.com/jack-weilage/whatcom-live</a
			>!
		</p>
		<p class="mb-2">
			whatcom.live is not officially associated with or endorsed by the Whatcom Transportation
			Authority or the Washington State Department of Transportation.
		</p>

		<button
			type="button"
			class="mt-8 block w-full rounded-md bg-black p-2 text-base text-white"
			on:click={closeDialog}>Close</button
		>
	</dialog>
</div>
