<script lang="ts">
	import { flip } from 'svelte/animate'
	import { fade } from 'svelte/transition'
	import { useInfiniteQuery } from '@sveltestack/svelte-query'
	import { DateTime } from 'luxon'
	import { goto } from '$app/navigation'
	import { Icon, NavigationItem, Loader } from '@/components/commons'
	import { HistoryRecord } from '@/components/History'
	import { visible } from '@/actions/visible'
	import { callGetRecordHistory } from '@/utils/fetch/records'
	import { Routes } from '@/utils/routes'
	import { QueryKey } from '@/utils/fetch/queryKeys'
	import type { RecordWithCounterAndLabel } from '@/@types/api/records'

	type RecordsByDate = Array<{
		date: string
		records: Array<RecordWithCounterAndLabel>
	}>

	let scrollY: number
	let size: number = 10
	let recordByDates: RecordsByDate = []
	let recordsIdLoaded: Array<number> = []
	let dateToRecordArrayMap: Map<string, Array<RecordWithCounterAndLabel>> = new Map()

	const records = useInfiniteQuery(
		QueryKey.GET_RECORD_HISTORY,
		({ pageParam = undefined }) =>
			callGetRecordHistory({
				size,
				cursor: pageParam,
			}),
		{
			getNextPageParam: (lastPage) => lastPage.cursorNext,
		}
	)

	$: if ($records.data) {
		for (const page of $records.data.pages) {
			for (const record of page.data) {
				if (recordsIdLoaded.includes(record.id)) break
				const jsDate = new Date(record.createdAt)
				const date = DateTime.fromJSDate(jsDate).toISODate()
				const existingGroup = dateToRecordArrayMap.get(date)
				if (existingGroup) {
					existingGroup.push(record)
				} else {
					const newRecordArray = [record]
					recordByDates.push({
						date,
						records: newRecordArray,
					})
					dateToRecordArrayMap.set(date, newRecordArray)
				}
				recordsIdLoaded.push(record.id)
			}
		}
		recordByDates = recordByDates
	}

	function onDeleteRecord(e: CustomEvent<RecordWithCounterAndLabel>) {
		const record = e.detail
		const jsDate = new Date(record.createdAt)
		const date = DateTime.fromJSDate(jsDate).toISODate()
		const existingGroup = dateToRecordArrayMap.get(date)
		if (existingGroup) {
			const deleteRecordIndex = existingGroup.findIndex((r) => r.id === record.id)
			existingGroup.splice(deleteRecordIndex, 1)
		}
	}
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

	{#if $records.isFetching && !$records.isFetched}
		<div class="mt-20 flex justify-center">
			<Loader />
		</div>
	{:else}
		<div class="mx-auto mb-24 flex w-full max-w-lg flex-col py-3">
			{#each recordByDates as { date, records } (date)}
				<h2 class="col-span-2 my-3 px-3 text-lg text-gray-400 first:mt-0" transition:fade>
					{DateTime.fromJSDate(new Date(date)).toFormat('ccc, d LLL y')}
				</h2>
				{#each records as record, index (record.id)}
					<HistoryRecord {record} on:delete={onDeleteRecord} />
				{/each}
			{/each}

			{#if $records.isFetchingNextPage}
				<div class="flex justify-center">
					<Loader />
				</div>
			{:else if $records.hasNextPage}
				<div use:visible on:visible={$records.fetchNextPage} />
			{/if}

			{#if $records.isFetched && !$records.hasNextPage}
				<div class="mt-3 text-center text-gray-400">End of history</div>
			{/if}
		</div>
	{/if}

	<!-- NAVIGATION TO HOME-->
	<div class="fixed bottom-6 right-6 z-30 space-y-6">
		<NavigationItem icon={Icon.Home} ariaLabel="navigate home" on:click={() => goto(Routes.HOME)} />
	</div>
</div>
