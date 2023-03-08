<script lang="ts">
	import { goto } from '$app/navigation'
	import { Icon } from '@/components/commons'
	import { Routes } from '@/utils/routes'
	import { fade } from 'svelte/transition'

	let scrollY: number
</script>

<svelte:window bind:scrollY />

<div class="container mx-auto min-h-screen pt-9">
	<h1
		class="sticky top-0 z-30 bg-white py-3  text-center text-4xl"
		class:shadow-lg={scrollY > 36}
		in:fade
	>
		History
	</h1>

	<div class="mx-auto mb-24 flex w-full max-w-lg flex-col py-3">
		<div>Records</div>
	</div>

	<!-- NAVIGATION TO HOME-->
	<div class="fixed bottom-6 right-6 z-30 space-y-6">
		<button
			on:click={() => goto(Routes.HOME)}
			aria-label="navigate home"
			class="flex aspect-square w-14 items-center justify-center rounded-full bg-gray-400 text-white shadow-lg transition-colors hover:bg-gray-500"
		>
			<Icon.Home class="h-8 w-8" />
		</button>
	</div>
</div>

<style>
	button {
		-webkit-tap-highlight-color: transparent;
	}
</style>
