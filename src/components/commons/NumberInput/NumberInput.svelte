<script lang="ts">
	export let value: number
	export let ref: HTMLInputElement | undefined = undefined
	export let hasError: boolean = false
	export { forwardClasses as class }

	let forwardClasses: string = ''
</script>

<input
	type="number"
	bind:value
	bind:this={ref}
	class={`${forwardClasses} block w-full rounded-lg border-2 border-gray-50 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-700`}
	class:has-error={hasError}
	step="0.01"
/>

<style>
	.has-error {
		@apply border-red-400;
	}
</style>
