<script lang="ts">
	import { goto } from '$app/navigation'
	import { Icon, NavigationItem, Page, PageHeader } from '@/components/commons'
	import Button from '@/components/commons/Button/Button.svelte'
	import { CounterBarChart, RecordBreakdown } from '@/components/Counter'
	import { formatCount } from '@/utils/format'
	import { Routes } from '@/utils/routes'
	import { fade } from 'svelte/transition'
	import type { PageData } from './$types'
	import { accumulateRecordIncrements } from '@/utils/counters'

	export let data: PageData

	const { counter, chartRecords } = data

	let lastIndexWithRecords = chartRecords.findLastIndex((r) => r.data.length > 0)
	let selectedIndex = lastIndexWithRecords > 0 ? lastIndexWithRecords : chartRecords.length - 1

	$: selectedIndexCount = formatCount(accumulateRecordIncrements(chartRecords[selectedIndex].data))
	$: selectedIndexRecords = chartRecords[selectedIndex].data

	function handleSelectIndex(event: CustomEvent<number>) {
		selectedIndex = event.detail
	}
</script>

{#if counter}
	<Page>
		<PageHeader>
			{counter?.title}
		</PageHeader>
		<p class="text-center text-xs text-gray-400">{counter.resetType}</p>
		{#key selectedIndex}
			<p class="pt-6 text-center text-4xl" in:fade>
				{selectedIndexCount}
			</p>
		{/key}

		<CounterBarChart
			{counter}
			{selectedIndex}
			data={chartRecords}
			color={counter.color}
			on:selectIndex={handleSelectIndex}
		/>

		<RecordBreakdown records={selectedIndexRecords} />
	</Page>

	<!-- NAVIGATION TO HOME-->
	<div class="fixed bottom-6 right-6 z-30 space-y-6">
		<NavigationItem icon={Icon.Home} ariaLabel="navigate home" on:click={() => goto(Routes.HOME)} />
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
