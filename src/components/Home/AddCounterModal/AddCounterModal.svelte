<script lang="ts">
	import { createEventDispatcher, tick } from 'svelte'
	import { fade } from 'svelte/transition'
	import { createMutation, useQueryClient } from '@tanstack/svelte-query'
	import type { z } from 'zod'
	import {
		Modal,
		TextInput,
		RadioInput,
		NumberInput,
		SwitchInput,
		ColorRadioInput,
		IncrementInput,
		FormItem,
	} from '@/components/commons'
	import {
		CounterColors,
		type CounterColor,
		CounterFormSchema,
		type NewCounterRequest,
	} from '@/@types/client/counters'
	import { ResetType, type Counter } from '@prisma/client'
	import { useForm } from '@/hooks/useForm'
	import { callCreateCounter } from '@/utils/fetch/counters'
	import { QueryKey } from '@/utils/fetch/queryKeys'
	import type { GetCounterResponse } from '@/@types/api/counters'
	import { updateCountersCacheWithNewCounter } from '@/utils/queryCache'

	export let isVisible: boolean = false

	const {
		form,
		refs,
		errors,
		onSubmit: handleFormSubmit,
		resetForm: handleResetForm,
	} = useForm({
		schema: CounterFormSchema,
		defaultValues: {
			title: '',
			resetType: ResetType.Day,
			hasTarget: false,
			target: 0,
			color: CounterColors[0],
			hasCustomIncrement: false,
			increment: 1,
		},
		onSubmitCallback(values: z.infer<typeof CounterFormSchema>) {
			const { title, resetType, increment, target, color } = values
			const newCounter: NewCounterRequest = {
				title,
				resetType,
				increment,
				target,
				color,
			}
			$createCounter.mutate(newCounter)
		},
	})
	const dispatch = createEventDispatcher()
	const queryClient = useQueryClient()
	const createCounter = createMutation(callCreateCounter, {
		onSuccess: submitCounterSuccessCB,
	})

	$: resetTypeValues = Object.entries(ResetType)
	$: ({ hasTarget } = form)
	$: if (isVisible) {
		focusFirstField()
	}
	$: if (hasTarget) {
		focusTargetRef()
	}

	async function focusFirstField() {
		await tick()
		refs.title?.focus()
	}

	async function focusTargetRef() {
		await tick()
		refs.target?.focus()
	}

	function handleFormCancel() {
		dispatch('modal-cancel')
		handleResetForm()
	}

	function handleFormClose() {
		dispatch('modal-close')
		handleResetForm()
	}

	function handleRadioSelect(event: CustomEvent<ResetType>) {
		form.resetType = event.detail
	}

	function handleColorRadioSelect(event: CustomEvent<CounterColor>) {
		form.color = event.detail
	}

	function submitCounterSuccessCB(res: Counter) {
		queryClient.setQueryData(QueryKey.GET_COUNTERS, (cache?: Array<GetCounterResponse>) =>
			updateCountersCacheWithNewCounter(cache || [], res)
		)
		dispatch('modal-close')
		handleResetForm()
	}
</script>

<Modal
	{isVisible}
	on:modal-confirm={handleFormSubmit}
	on:modal-cancel={handleFormCancel}
	on:modal-close={handleFormClose}
	isConfirmLoading={$createCounter.isLoading}
>
	<p class="mb-3 text-3xl">Create</p>
	<form on:submit|preventDefault={handleFormSubmit} class="flex flex-col">
		<FormItem label="What are you counting?" errorMessage={$errors.title}>
			<TextInput bind:value={form.title} bind:ref={refs.title} hasError={!!$errors.title} />
		</FormItem>
		<FormItem label="Resets every:">
			<div class="flex flex-wrap gap-3">
				{#each resetTypeValues as [resetKey, resetType] (resetKey)}
					<RadioInput
						name="reset_type"
						bind:group={form.resetType}
						value={resetType}
						on:radio-select={handleRadioSelect}
						on:radio-submit={handleFormSubmit}
					/>
				{/each}
			</div>
		</FormItem>
		<FormItem label="Counter increment:">
			<IncrementInput
				bind:value={form.increment}
				bind:isCustom={form.hasCustomIncrement}
				on:switch-submit={handleFormSubmit}
			/>
		</FormItem>
		<FormItem label="Set a target?" errorMessage={$errors.target}>
			<div class="flex flex-wrap items-center gap-3">
				<SwitchInput bind:isToggle={form.hasTarget} on:switch-submit={handleFormSubmit} />
				{#if form.hasTarget}
					<div class="flex flex-1 flex-wrap items-center gap-3" transition:fade>
						<p class="flex-none text-sm text-gray-500">Target:</p>
						<NumberInput
							bind:ref={refs.target}
							bind:value={form.target}
							class="flex-1"
							hasError={!!$errors.target}
						/>
					</div>
				{/if}
			</div>
		</FormItem>
		<FormItem label="Pick a color:">
			<div class="flex max-w-xl flex-wrap gap-3">
				{#each CounterColors as color, i (i)}
					<ColorRadioInput
						bind:group={form.color}
						value={color}
						on:radio-select={handleColorRadioSelect}
						on:radio-submit={handleFormSubmit}
					/>
				{/each}
			</div>
		</FormItem>
		<input type="submit" hidden />
	</form>
</Modal>
