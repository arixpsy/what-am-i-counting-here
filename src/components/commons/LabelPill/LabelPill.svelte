<script lang="ts">
	import { Icon } from '@/components/commons'

	export let onClose: (() => void) | undefined = undefined
	export let clickable: boolean = false
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="flex items-center gap-1 rounded-full bg-gray-200 py-1 pl-3 text-sm text-gray-400"
	class:pr-1={onClose}
	class:pr-3={!onClose}
	class:cursor-pointer={clickable}
	on:click
>
	<span><slot /></span>
	{#if onClose}
		<span
			class="inline-block cursor-pointer rounded-full p-1 transition-colors hover:bg-gray-100"
			on:click={onClose}
		>
			<Icon.Cross class="h-3 w-3" />
		</span>
	{/if}
</div>

<style>
	div {
		-webkit-tap-highlight-color: transparent;
	}
</style>
