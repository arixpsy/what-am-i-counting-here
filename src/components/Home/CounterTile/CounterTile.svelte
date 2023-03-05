<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { scale } from 'svelte/transition'
	import { useMutation, useQueryClient } from '@sveltestack/svelte-query'
	import type { Counter, Record } from '@prisma/client'
	import { goto } from '$app/navigation'
	import KeyCode from '@/@types/commons/keycode'
	import { getCounterTypeLabel } from '@/components/Home/CounterTile/utils'
	import { Icon } from '@/components/commons'
	import { longpress } from '@/actions/longpress'
	import { Routes } from '@/utils/routes'
	import { callDeleteCounter } from '@/utils/fetch/counters'
	import { QueryKey } from '@/utils/fetch/queryKeys'
	import { callCreateRecord } from '@/utils/fetch/records'
	import type { GetCounterResponse } from '@/@types/api/counters'
	import { formatCount } from '@/utils/format'

	export let counter: Counter
	export let currentCount: number
	export let isSortMode: boolean = false

	$: counterTypeLabel = getCounterTypeLabel(counter)

	const dispatch = createEventDispatcher<{
		'custom-increment': number
	}>()
	const queryClient = useQueryClient()
	const deleteCounter = useMutation(callDeleteCounter, {
		onSuccess: deleteCounterSuccessCB,
	})
	const createRecord = useMutation(callCreateRecord, {
		onSuccess: createRecordSuccessCB,
	})

	function handleKeyPress(e: KeyboardEvent) {
		switch (e.code) {
			case KeyCode.SPACE:
				handleClickCounter()
				return
		}
	}

	function handleClickCounter() {
		if (counter.increment === 0) {
			dispatch('custom-increment', counter.id)
			return
		}
		handleCounterIncrement()
	}

	function handleCounterIncrement() {
		$createRecord.mutate({
			counterId: counter.id,
			description: '',
			increment: counter.increment,
			labels: [],
		})
	}

	function handleDeleteCounter() {
		$deleteCounter.mutate(counter.id)
	}

	function handleNavigateToCounter() {
		goto(`${Routes.COUNTER}/${counter.id}`)
	}

	function deleteCounterSuccessCB() {
		queryClient.invalidateQueries({ queryKey: QueryKey.GET_COUNTERS })
	}

	function createRecordSuccessCB(res: Record) {
		queryClient.setQueryData(QueryKey.GET_COUNTERS, (data?: Array<GetCounterResponse>) => {
			const newCache: Array<GetCounterResponse> = []
			if (!data) return newCache
			for (const counter of data) {
				if (counter.id === res.counterId) {
					newCache.push({
						...counter,
						currentCount: currentCount + res.increment,
					})
				} else {
					newCache.push(counter)
				}
			}
			return newCache
		})
	}
</script>

<div
	class="relative flex aspect-square select-none flex-col items-center justify-center rounded-lg p-2"
	class:cursor-pointer={!isSortMode}
	class:cursor-grab={isSortMode}
	style="background-color: {counter.color}"
	tabIndex={isSortMode ? -1 : 0}
	on:click={isSortMode ? undefined : handleClickCounter}
	on:keyup={isSortMode ? undefined : handleKeyPress}
	use:longpress={{ enabled: !isSortMode }}
	on:longpress={handleNavigateToCounter}
>
	<!-- Delete Button -->
	{#if isSortMode}
		<div class="absolute -top-2 -right-2" in:scale>
			<button
				class="flex aspect-square h-8 items-center justify-center rounded-full border-2 border-white bg-red-400 text-white transition-transform hover:scale-125"
				on:click={handleDeleteCounter}
			>
				<Icon.Minus class="h-6 w-6" />
			</button>
		</div>
	{/if}

	<!-- Counter Labels -->
	<p class="text-md w-full truncate text-center text-gray-100">
		{counter.title}
	</p>
	<p class="w-full text-center text-xs">{counterTypeLabel}</p>
	{#key currentCount}
		<p
			class="my-3 w-full overflow-x-hidden overflow-y-clip text-center text-3xl font-bold"
			in:scale|local
		>
			{formatCount(currentCount)}
		</p>
	{/key}
</div>

<style>
	div {
		-webkit-tap-highlight-color: transparent;
	}
</style>
