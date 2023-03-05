<script lang="ts">
	import { createEventDispatcher, tick } from 'svelte'
	import type { z } from 'zod'
	import {
		Modal,
		FormItem,
		NumberInput,
		TextInput,
		LabelPill,
		CustomLabelInput,
	} from '@/components/commons'
	import { IncrementPreviewTile } from '@/components/Home'
	import { RecordFormSchema } from '@/@types/client/records'
	import { useForm } from '@/hooks/useForm'
	import type { NewRecordRequest } from '@/@types/client/records'
	import { useQuery } from '@sveltestack/svelte-query'
	import { QueryKey } from '@/utils/fetch/queryKeys'
	import { callGetCounters } from '@/utils/fetch/counters'
	import { callGetLabels } from '@/utils/fetch/label'
	import { scale } from 'svelte/transition'
	import { derived } from 'svelte/store'

	export let counterId: number | undefined
	export let isVisible: boolean

	const {
		form,
		refs,
		errors,
		onSubmit: handleFormSubmit,
		resetForm: handleResetForm,
	} = useForm({
		schema: RecordFormSchema,
		defaultValues: {
			increment: 1,
			labels: [],
			description: '',
		},
		onSubmitCallback(values: z.infer<typeof RecordFormSchema>) {
			const counterId = counter?.id
			if (!counterId) return
			const { increment, labels: recordLabels, description } = values
			const newRecord: NewRecordRequest = {
				counterId,
				increment,
				labels: recordLabels,
				description,
			}
			console.log(newRecord)
			// TODO: call api
			dispatch('modal-close')
			handleResetForm()
		},
	})
	const dispatch = createEventDispatcher()
	const counters = useQuery(QueryKey.GET_COUNTERS, callGetCounters)
	const labels = useQuery(QueryKey.GET_LATEST_LABELS, callGetLabels)

	$: counter = $counters.data?.find((c) => c.id === counterId)
	$: filterLabels = derived(labels, ($labels) =>
		$labels.data?.filter((l) => !form.labels.includes(l.id))
	)
	$: if (isVisible) {
		focusFirstField()
	}

	async function focusFirstField() {
		await tick()
		refs.increment?.focus()
	}

	function handleFormCancel() {
		dispatch('modal-cancel')
		handleResetForm()
	}

	function handleFormClose() {
		dispatch('modal-close')
		handleResetForm()
	}

	function handleAddLabel(label: string) {
		form.labels = [...form.labels, label]
	}
</script>

<Modal
	{isVisible}
	on:modal-confirm={handleFormSubmit}
	on:modal-cancel={handleFormCancel}
	on:modal-close={handleFormClose}
>
	<p class="mb-3 w-72 text-3xl">Add</p>
	<form on:submit|preventDefault={handleFormSubmit} class="flex flex-col">
		<FormItem label="What amount?" errorMessage={$errors.increment}>
			<NumberInput
				bind:value={form.increment}
				bind:ref={refs.increment}
				hasError={!!$errors.increment}
			/>
		</FormItem>
		<FormItem label="Short description:">
			<TextInput bind:value={form.description} />
		</FormItem>
		<FormItem label="Labels:">
			<CustomLabelInput bind:value={form.labels} on:input-submit={handleFormSubmit} />
			<div class="mt-3 flex h-7 items-center">
				<span class="min-w-fit text-xs text-gray-400">Recently used:</span>
				<div class="scrollbar-hide flex w-full gap-2 overflow-x-scroll px-3">
					{#if $filterLabels}
						{#each $filterLabels as label}
							<div transition:scale>
								<LabelPill clickable on:click={() => handleAddLabel(label.id)}>{label.id}</LabelPill
								>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		</FormItem>
		<FormItem label="Preview:">
			<IncrementPreviewTile {counter} increment={form.increment} />
		</FormItem>
		<input type="submit" hidden />
	</form>
</Modal>

<style>
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}

	.scrollbar-hide {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
</style>
