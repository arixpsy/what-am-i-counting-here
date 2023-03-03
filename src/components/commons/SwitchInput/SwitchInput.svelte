<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import KeyCode from '@/@types/commons/keycode'
  
	export let isToggle: boolean = false

	const dispatch = createEventDispatcher()

	function handleKeyUp(e: KeyboardEvent) {
		switch (e.code) {
			case KeyCode.ENTER:
				dispatch('switch-submit')
				return
			case KeyCode.SPACE:
				isToggle = !isToggle
				return
		}
	}
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div
	tabindex="0"
	class="relative my-1 h-9 w-16 cursor-pointer select-none rounded-full p-1 transition-colors"
	class:bg-gray-200={!isToggle}
	class:bg-blue-700={isToggle}
	on:click={() => (isToggle = !isToggle)}
	on:keyup={handleKeyUp}
>
	<div
		class="absolute flex h-7 w-7 justify-center rounded-full bg-white transition-transform"
		class:translate-x-7={isToggle}
	/>
</div>

<style>
	div {
		-webkit-tap-highlight-color: transparent;
	}
</style>
