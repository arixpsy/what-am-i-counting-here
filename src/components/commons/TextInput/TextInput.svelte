<script lang="ts">
	export let value: string
	export let ref: HTMLInputElement | undefined = undefined
	export let hasError: boolean = false
</script>

<input
	type="text"
	bind:value
	bind:this={ref}
	class="block w-full rounded-lg border-2 border-gray-50 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-700"
	class:has-error={hasError}
/>

<style>
	.has-error {
		@apply border-red-400;
	}
</style>
