<script lang="ts">
	import type { Icon } from '@/components/commons'
	import { fly, fade } from 'svelte/transition'

	export let icon: (typeof Icon)[keyof typeof Icon]
	export let inFly: { x: number; delay: number } | undefined = undefined
	export let outFly: { x: number; delay: number } | undefined = undefined
	export let ref: HTMLButtonElement | undefined = undefined
	export let ariaLabel: string | undefined = undefined
	export let isClose: boolean = false
</script>

<button
	in:fly|local={inFly}
	out:fly|local={outFly}
	bind:this={ref}
	class={`flex aspect-square w-14 items-center justify-center rounded-full text-white shadow-lg transition-colors`}
	class:bg-gray-400={!isClose}
	class:hover:bg-gray-500={!isClose}
	class:bg-red-400={isClose}
	class:hover:bg-red-500={isClose}
	aria-label={ariaLabel}
	on:click
>
	{#key icon}
		<div in:fade>
			<svelte:component this={icon} class="h-8 w-8" />
		</div>
	{/key}
</button>

<style>
	button {
		-webkit-tap-highlight-color: transparent;
	}
</style>
