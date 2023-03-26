<script lang="ts">
	import { goto } from '$app/navigation'
	import { Icon, NavigationItem } from '@/components/commons'
	import Button from '@/components/commons/Button/Button.svelte'
	import { CounterBarChart } from '@/components/Counter'
	import { formatCount } from '@/utils/format'
	import { Routes } from '@/utils/routes'
	import { fade } from 'svelte/transition'
	import type { PageData } from './$types'

	export let data: PageData

	const { counter, currentCount, chartRecords } = data
	let scrollY: number
</script>

<svelte:window bind:scrollY />

{#if counter}
	<div class="container mx-auto min-h-screen pt-9">
		<h1
			class="sticky top-0 z-30 bg-white py-3 text-center text-4xl"
			class:shadow-lg={scrollY > 36}
			in:fade
		>
			{counter?.title}
		</h1>
		<p class="text-center text-xs text-gray-400">{counter.resetType}</p>
		<p class="pt-6 text-center text-4xl">{formatCount(currentCount)}</p>

		<CounterBarChart data={chartRecords} color={counter.color} />
		<!-- NAVIGATION TO HOME-->
		<div class="fixed bottom-6 right-6 z-30 space-y-6">
			<NavigationItem
				icon={Icon.Home}
				ariaLabel="navigate home"
				on:click={() => goto(Routes.HOME)}
			/>
		</div>
	</div>
{:else}
	<div class="flex h-screen flex-col items-center justify-center gap-6 p-3">
		<Icon.ExclamationCircle class="h-24 w-24 text-red-400" />
		<h1 class=" text-center text-3xl" in:fade>Counter not found</h1>
		<a href={Routes.HOME}>
			<Button>Back to home</Button>
		</a>
	</div>
{/if}
