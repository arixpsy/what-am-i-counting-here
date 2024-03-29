<script lang="ts">
	import { flip } from 'svelte/animate'
	import { scale, fade } from 'svelte/transition'
	import { createQuery } from '@tanstack/svelte-query'
	import { goto } from '$app/navigation'
	import { Icon, Navigation, NavigationItem, Loader, Page, PageHeader } from '@/components/commons/'
	import { AddCounterModal, CounterTile, CustomIncrementModal } from '@/components/Home'
	import KeyCode from '@/@types/commons/keycode'
	import { Routes } from '@/utils/routes'
	import { callGetCounters } from '@/utils/fetch/counters'
	import { QueryKey } from '@/utils/fetch/queryKeys'
	import type { PageData } from './$types'

	export let data: PageData

	let isSortMode: boolean = false
	let isMenuOpen: boolean = false
	let isAddModalOpen = false
	let isCustomIncrementModalOpen = false
	let customIncrementEvent: number | undefined = undefined

	const counters = createQuery({
		queryKey: QueryKey.GET_COUNTERS,
		queryFn: callGetCounters,
		initialData: data.counters,
	})

	const navItems = [
		{
			icon: Icon.Plus,
			onClick: () => {
				isMenuOpen = false
				toggleAddModalOpen()
			},
			label: 'add new counter',
		},
		{
			icon: Icon.FourSquare,
			onClick: () => {
				isMenuOpen = false
				isSortMode = true
			},
			label: 'sort counters',
		},
		{
			icon: Icon.Calendar,
			onClick: () => {
				// setting isMenuOpen to false to prevent overflow page transition bug
				isMenuOpen = false
				goto(Routes.HISTORY)
			},
			label: 'view history',
		},
		{
			icon: Icon.Cog,
			onClick: () => {
				// setting isMenuOpen to false to prevent overflow page transition bug
				isMenuOpen = false
				goto(Routes.OPTIONS)
			},
			label: 'view options',
		},
	]

	function handleGlobalKeyUp(e: KeyboardEvent) {
		if (isAddModalOpen) {
			if (e.code === KeyCode.ESCAPE) {
				toggleAddModalOpen()
				return
			}
			return
		}
		if (isCustomIncrementModalOpen) {
			if (e.code === KeyCode.ESCAPE) {
				toggleCustomIncrementModalOpen()
				return
			}
			return
		}
		if (isSortMode) {
			if (e.code === KeyCode.ESCAPE) {
				isSortMode = false
				return
			}
			return
		}
		if (isMenuOpen) {
			if (e.code === KeyCode.ESCAPE) {
				isMenuOpen = false
				return
			}
			return
		}
		switch (e.code) {
			case KeyCode.N:
				toggleAddModalOpen()
				return
			case KeyCode.E:
				isSortMode = true
				return
			case KeyCode.H:
				goto(Routes.HISTORY)
				return
		}
	}

	function toggleAddModalOpen() {
		isAddModalOpen = !isAddModalOpen
	}

	function toggleCustomIncrementModalOpen() {
		isCustomIncrementModalOpen = !isCustomIncrementModalOpen
		if (!isCustomIncrementModalOpen) {
			customIncrementEvent = undefined
		}
	}

	function handleCustomIncrement(e: CustomEvent<number>) {
		customIncrementEvent = e.detail
		isCustomIncrementModalOpen = true
	}
</script>

<svelte:window on:keyup={handleGlobalKeyUp} />

<Page>
	<!-- HEADER -->
	<PageHeader>
		{#if isSortMode}
			<p in:fade>Sort Mode</p>
		{:else}
			<p in:fade>WAICH</p>
		{/if}
	</PageHeader>

	<!-- COUNTER TILES -->
	<div
		class="grid auto-rows-min grid-cols-2 gap-3 p-3 outline-none sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"
		style="height: calc(100% - 100px);"
	>
		{#if $counters.data}
			{#each $counters.data as counter (counter.id)}
				<div animate:flip={{ duration: 400 }} in:scale>
					<CounterTile
						{counter}
						currentCount={counter.currentCount}
						{isSortMode}
						on:custom-increment={handleCustomIncrement}
					/>
				</div>
			{/each}
		{/if}
	</div>
</Page>

<!-- NAVIGATION MENU -->
{#if isSortMode}
	<div class="fixed bottom-6 right-6 space-y-6">
		<NavigationItem
			icon={Icon.Cross}
			ariaLabel="exit sort mode"
			on:click={() => (isSortMode = false)}
			isClose
		/>
	</div>
{:else}
	<Navigation bind:isMenuOpen navigationItems={navItems} />
{/if}

<!-- MODALS -->
<AddCounterModal
	isVisible={isAddModalOpen}
	on:modal-submit={toggleAddModalOpen}
	on:modal-close={toggleAddModalOpen}
	on:modal-cancel={toggleAddModalOpen}
/>

<CustomIncrementModal
	counterId={customIncrementEvent}
	isVisible={isCustomIncrementModalOpen}
	on:modal-submit={toggleCustomIncrementModalOpen}
	on:modal-close={toggleCustomIncrementModalOpen}
	on:modal-cancel={toggleCustomIncrementModalOpen}
/>
