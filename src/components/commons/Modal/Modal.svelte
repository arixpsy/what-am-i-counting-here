<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { fade } from 'svelte/transition'
	import Portal from 'svelte-portal'
	import { Button } from '@/components/commons'
	import KeyCode from '@/@types/commons/keycode'

	export let isVisible = false
	export let confirmText = 'Confirm'
	export let cancelText = 'Cancel'

	const dispatch = createEventDispatcher<any>()

	function handleKeyUp(e: KeyboardEvent) {
		if (e.code === KeyCode.ESCAPE) handleClose()
	}

	function handleOnConfirm() {
		dispatch('modal-confirm')
	}

	function handleClose() {
		if (isVisible) dispatch('modal-close')
	}

	function handleCancel() {
		dispatch('modal-cancel')
	}
</script>

<Portal target="body">
	{#if isVisible}
		<div
			class="fixed inset-0 z-20 flex items-center justify-center"
			on:keyup={handleKeyUp}
			transition:fade
		>
			<div
				class="absolute h-full w-full bg-black opacity-50"
				on:click={handleClose}
				on:keypress={() => {}}
			/>
			<div
				class={`absolute flex h-full max-h-full w-full flex-col bg-white sm:h-fit sm:w-fit sm:rounded-lg`}
			>
				<!-- Content -->
				<div class="h-full overflow-auto p-6">
					<slot />
				</div>

				<!-- Footer -->
				<div class="flex h-24 space-x-6 p-6">
					<Button on:click={handleCancel} block>{cancelText}</Button>
					<Button color="primary" on:click={handleOnConfirm} block>{confirmText}</Button>
				</div>
			</div>
		</div>
	{/if}
</Portal>
