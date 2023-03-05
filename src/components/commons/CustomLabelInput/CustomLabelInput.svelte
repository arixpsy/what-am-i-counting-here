<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { fade, scale } from 'svelte/transition'
	import { useMutation } from '@sveltestack/svelte-query'
	import KeyCode from '@/@types/commons/keycode'
	import { LabelPill } from '@/components/commons'
	import { capitalizeWord } from '@/utils/format'
	import { callSearchLabels } from '@/utils/fetch/label'
	import { QueryKey } from '@/utils/fetch/queryKeys'

	export let value: Array<string>

	let inputValue: string = ''
	let inputRef: HTMLInputElement

	const dispatch = createEventDispatcher()
	const similarLabels = useMutation(QueryKey.GET_LATEST_LABELS, callSearchLabels)

	async function handleKeyPress(e: KeyboardEvent) {
		switch (e.code) {
			case KeyCode.ENTER:
				e.preventDefault()
				if (inputValue.trim() === '') {
					dispatch('input-submit')
				} else {
					handleAddLabel()
				}
				return
			case KeyCode.SPACE:
				handleAddLabel()
				return
			default:
				// TODO: add debounce
				setTimeout(() => $similarLabels.mutate({ searchPhrase: inputValue }), 250)
				return
		}
	}

	function handleOptionKeyUp(label?: string) {
		return (e: KeyboardEvent) => {
			switch (e.code) {
				case KeyCode.ENTER:
					handleAddLabel(label)
					focusInput()
					return
				case KeyCode.SPACE:
					handleAddLabel(label)
					focusInput()
					return
			}
		}
	}

	function handleAddLabel(existingLabel?: string) {
		const newLabel = existingLabel ?? inputValue.trim()
		if (newLabel.length === 0) return
		if (!value.includes(newLabel)) {
			value = [...value, capitalizeWord(newLabel)]
			inputValue = ''
		} else {
			inputValue = ''
		}
	}

	function removeLabel(label: string) {
		value = value.filter((v) => v !== label)
	}

	function focusInput() {
		inputRef.focus()
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="flex w-full cursor-text flex-wrap gap-2 rounded-lg border-2 border-gray-50 bg-gray-50 py-1.5 px-2.5 text-sm  text-gray-900 outline-none transition-colors  focus-within:border-blue-700"
	on:click={focusInput}
>
	{#each value as label (label)}
		<div transition:scale>
			<LabelPill onClose={() => removeLabel(label)}>{label}</LabelPill>
		</div>
	{/each}
	<input
		type="text"
		bind:value={inputValue}
		bind:this={inputRef}
		size="5"
		class="w-full min-w-fit flex-1 bg-inherit py-1 outline-none"
		on:keypress={handleKeyPress}
	/>
</div>
<div class="relative">
	{#if inputValue.trim().length > 0}
		<div
			class="absolute top-1 left-0 right-0 max-h-44 overflow-y-auto rounded-lg bg-gray-50 text-sm text-gray-900 shadow-lg"
			transition:fade
		>
			<div class="mt-3 px-2.5 text-xs text-gray-400">New label:</div>
			<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
			<div
				tabindex="0"
				class="cursor-pointer p-2.5 transition-colors hover:bg-blue-100"
				on:click={() => handleAddLabel()}
				on:keyup={handleOptionKeyUp()}
			>
				{inputValue}
			</div>
			<hr />
			<div class="mt-3 px-2.5 text-xs text-gray-400">Previously used:</div>
			{#if $similarLabels.data}
				{#each $similarLabels.data as label (label)}
					<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
					<div
						tabindex="0"
						class="flex cursor-pointer p-2.5 transition-colors hover:bg-blue-100"
						on:click={() => handleAddLabel(label.id)}
						on:keyup={handleOptionKeyUp(label.id)}
					>
						{label.id}
					</div>
				{:else}
					<div class="my-3 p-2.5 text-center text-xs text-gray-400" in:fade>No matches</div>
				{/each}
			{/if}
		</div>
	{/if}
</div>
