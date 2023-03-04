<script lang="ts">
	import { onMount } from 'svelte'
	import { flip } from 'svelte/animate'
	import { scale, fade } from 'svelte/transition'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import type { GetCounterResponse } from '@/@types/api/counters'
	import type { CustomIncrementEvent } from '@/@types/client/records'
	import { Button } from '@/components/commons/'
	import { AddCounterModal, CounterTile } from '@/components/Home'
	import { Routes } from '@/utils/routes'
	import KeyCode from '@/@types/commons/keycode'
	import NavigationBurger from '@/components/Home/NavigationBurger/NavigationBurger.svelte'

	let scrollY: number
	let isSortMode: boolean = false
	let isMenuOpen: boolean = false
	let isAddModalOpen = false
	let isCustomIncrementModalOpen = false
	let customIncrementEvent: CustomIncrementEvent | undefined = undefined
	let counters: Array<GetCounterResponse> = []

	onMount(async () => {
		console.log($page.data.user.displayName)
		counters = await fetch('/api/counters').then((res) => res.json())
	})

	function handleGlobalKeyUp(e: KeyboardEvent) {
    if (isAddModalOpen) {
      if (e.code === KeyCode.ESCAPE) {
        toggleAddModalOpen();
        return;
      }
      return;
    }
    if (isCustomIncrementModalOpen) {
      if (e.code === KeyCode.ESCAPE) {
        toggleCustomIncrementModalOpen();
        return;
      }
      return;
    }
    if (isSortMode) {
      if (e.code === KeyCode.ESCAPE) {
        isSortMode = false;
        return;
      }
      return;
    }
    if (isMenuOpen) {
      if (e.code === KeyCode.ESCAPE) {
        isMenuOpen = false;
        return;
      }
      return;
    }
    switch (e.code) {
      case KeyCode.N:
        toggleAddModalOpen();
        return;
      case KeyCode.E:
        isSortMode = true;
        return;
      case KeyCode.H:
        goto(Routes.HISTORY);
        return;
    }
  }

	function toggleAddModalOpen() {
    isAddModalOpen = !isAddModalOpen;
  }

	function toggleCustomIncrementModalOpen() {
    isCustomIncrementModalOpen = !isCustomIncrementModalOpen;
    if (!isCustomIncrementModalOpen) {
      customIncrementEvent = undefined;
    }
  }
</script>

<svelte:window on:keyup={handleGlobalKeyUp} bind:scrollY />

<div class="container mx-auto min-h-screen pt-9">
	<!-- HEADER -->
	<h1
      class="sticky top-0 z-10 bg-white py-3  text-center text-4xl"
      class:shadow-lg={scrollY > 36}
    >
      {#if isSortMode}
        <p in:fade>Sort Mode</p>
      {:else}
        <p in:fade>WAICH</p>
      {/if}
    </h1>

	<!-- COUNTER TILES -->
	<div
		class="grid auto-rows-min grid-cols-2 gap-3 p-3 outline-none sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"
		style="height: calc(100% - 100px);"
	>
		{#each counters as counter (counter.id)}
			<div animate:flip={{ duration: 400 }} in:scale>
				<CounterTile {counter} currentCount={counter.currentCount} {isSortMode} />
			</div>
		{/each}
	</div>

	<a href={Routes.LOGOUT}>
		<Button>Logout</Button>
	</a>
</div>

<!-- NAVIGATION MENU -->
<NavigationBurger 
	bind:isMenuOpen
	bind:isSortMode
	on:new-counter={toggleAddModalOpen}
/>

<!-- MODALS -->
<AddCounterModal
	isVisible={isAddModalOpen}
	on:modal-submit={toggleAddModalOpen}
	on:modal-close={toggleAddModalOpen}
	on:modal-cancel={toggleAddModalOpen}
/>
