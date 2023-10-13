<script lang="ts">
	import { page } from '$app/stores'
</script>

<div class="flex min-h-screen flex-col items-center justify-center">
	<h1 class="text-3xl leading-none">
		Error {$page.status}
		<span class="font-extralight text-gray-500">
			{$page.error?.message}
		</span>
	</h1>
	{#if $page.status === 404}
		<p class="text-gray-600">
			If you expected this action to work, try <a
				class="text-blue-600"
				data-sveltekit-reload
				href=".">reloading</a
			>.
		</p>
		<p class="mt-3 text-gray-600">
			If this error persists, <a
				href="https://github.com/jack-weilage/whatcom-live/issues"
				class="text-blue-600">file an issue</a
			>.
		</p>
	{/if}
</div>
