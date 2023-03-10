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

	let scrollY: number
	let size: number = 10

	const historyRecords = useInfiniteQuery(
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
		{#if $historyRecords.data?.pages}
			{#each $historyRecords.data.pages as page}
				{#each page.data as { date, records } (date)}
					<h2 class="col-span-2 my-3 px-3 text-lg text-gray-400 first:mt-0" transition:fade>
						{DateTime.fromJSDate(new Date(date)).toFormat('ccc, d LLL y')}
					</h2>
					{#each records as record, index (record.id)}
						<div animate:flip={{ duration: 400 }} out:fade>
							<HistoryRecord {record} {index} />
						</div>
					{/each}
				{/each}
			{/each}
		{/if}

		{#if !$historyRecords.isFetching && $historyRecords.hasNextPage}
			<div class="flex justify-center">
				<div use:visible on:visible={$historyRecords.fetchNextPage}>
					<Loader />
				</div>
			</div>
		{/if}

		{#if $historyRecords.isFetched && !$historyRecords.hasNextPage}
			<div class="mt-3 text-center text-gray-400">End of history</div>
		{/if}
	</div>

	<!-- NAVIGATION TO HOME-->
	<div class="fixed bottom-6 right-6 z-30 space-y-6">
		<NavigationItem icon={Icon.Home} ariaLabel="navigate home" on:click={() => goto(Routes.HOME)} />
	</div>
</div>
