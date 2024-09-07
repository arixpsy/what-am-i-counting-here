<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { linear } from 'svelte/easing'
	import { tweened } from 'svelte/motion'
	import { scale } from 'svelte/transition'
	import { createMutation, useQueryClient } from '@tanstack/svelte-query'
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
	import { updateCounterCacheWithRecord } from '@/utils/queryCache'

	export let counter: Counter
	export let currentCount: number
	export let isSortMode: boolean = false

	let isLongpress: boolean = false
	let isLongpressCooldown = false

	$: counterTypeLabel = getCounterTypeLabel(counter)
	$: if (isLongpress) pressedProgess.set(100)
	$: if (!isLongpress) pressedProgess.set(0)
	$: if (isLongpressCooldown) setTimeout(() => (isLongpressCooldown = false), 100)
	
	const TILE_HOLD_DURATION = 750
	const dispatch = createEventDispatcher<{
		'custom-increment': number
	}>()
	const queryClient = useQueryClient()
	const deleteCounter = createMutation(callDeleteCounter, {
		onSuccess: deleteCounterSuccessCB,
	})
	const createRecord = createMutation(callCreateRecord, {
		onSuccess: createRecordSuccessCB,
	})
	const pressedProgess = tweened(0, {
		duration: TILE_HOLD_DURATION,
		easing: linear,
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
		queryClient.setQueryData(QueryKey.GET_COUNTERS, (cache?: Array<GetCounterResponse>) => {
			if (!cache) return []
			return cache.filter((c) => c.id !== counter.id)
		})
	}

	function createRecordSuccessCB(res: Record) {
		queryClient.setQueryData(QueryKey.GET_COUNTERS, (cache?: Array<GetCounterResponse>) => {
			if (!cache) return []
			return updateCounterCacheWithRecord(cache, res)
		})
	}
</script>

<div
	class="relative flex aspect-square select-none flex-col items-center justify-center rounded-lg p-2"
	class:cursor-pointer={!isSortMode}
	class:cursor-grab={isSortMode}
	style="background-color: {counter.color}"
	tabIndex={isSortMode ? -1 : 0}
	on:keyup={isSortMode ? undefined : handleKeyPress}
	use:longpress={{
		enabled: !isSortMode,
		threshold: TILE_HOLD_DURATION,
		delay: 200,
	}}
	on:longpressStart={() => (isLongpress = true)}
	on:longpressMouseUp={() => {
		isLongpress = false
		isLongpressCooldown = true
	}}
	on:click={isSortMode || isLongpressCooldown ? undefined : handleClickCounter}
	on:longpressEnd={handleNavigateToCounter}
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

	<!-- Longpress animation -->
	<div
		class="pointer-events-none absolute inset-1 z-0 grid rounded-lg p-1"
		style="background:repeating-conic-gradient(from -43deg, white 0%, white {$pressedProgess}%, transparent {$pressedProgess}%, transparent 100%)"
	>
		<div class="rounded-md" style="background-color: {counter.color}" />
	</div>

	<!-- Counter Labels -->
	<div class="z-10 flex flex-col items-center justify-center">
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
</div>

<style>
	div {
		-webkit-tap-highlight-color: transparent;
	}
</style>
