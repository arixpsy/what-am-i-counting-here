<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { scale } from 'svelte/transition'
	import type { Counter } from '@prisma/client'
	import { goto } from '$app/navigation'
	import KeyCode from '@/@types/commons/keycode'
	import type { CustomIncrementEvent } from '@/@types/client/records'
	import { getCounterTypeLabel } from '@/components/Home/CounterTile/utils'
	import { Icon } from '@/components/commons'
	import { longpress } from '@/actions/longpress'
	import { Routes } from '@/utils/routes'
	import type { CounterColor } from '@/@types/client/counters'

	export let counter: Counter
	export let currentCount: number
	export let isSortMode: boolean = false

	$: counterTypeLabel = getCounterTypeLabel(counter)

	const dispatch = createEventDispatcher<{
		'custom-increment': CustomIncrementEvent
	}>()

	function handleKeyPress(e: KeyboardEvent) {
		switch (e.code) {
			case KeyCode.SPACE:
				handleClickCounter()
				return
		}
	}

	function handleClickCounter() {
		if (counter.increment === 0) {
			dispatch('custom-increment', {
				counterId: counter.id,
				counterTitle: counter.title,
				counterColor: counter.color as CounterColor,
				latestValue: currentCount,
			})
			return
		}
		handleCounterIncrement()
	}

	function handleCounterIncrement() {
		// TODO: call api
	}

	function handleDeleteCounter() {
		// TODO: call api
	}

	function handleNavigateToCounter() {
		goto(`${Routes.COUNTER}/${counter.id}`)
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
			{#if counter.target}
				{currentCount.toLocaleString(undefined, {
					maximumFractionDigits: 2,
					minimumFractionDigits: 0,
				})}/{counter.target}
			{:else}
				{currentCount.toLocaleString(undefined, {
					maximumFractionDigits: 2,
					minimumFractionDigits: 0,
				})}
			{/if}
		</p>
	{/key}
</div>

<style>
	div {
		-webkit-tap-highlight-color: transparent;
	}
</style>
