<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog'
	import { QuestionMark } from 'radix-icons-svelte'
</script>

<AlertDialog.Root closeOnOutsideClick={true}>
	<AlertDialog.Trigger asChild let:builder>
		<button use:builder.action {...builder}>
			<QuestionMark class="mapboxgl-ctrl-icon p-1.5" />
		</button>
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Title>About</AlertDialog.Title>
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

		<AlertDialog.Action>Close</AlertDialog.Action>
	</AlertDialog.Content>
</AlertDialog.Root>
