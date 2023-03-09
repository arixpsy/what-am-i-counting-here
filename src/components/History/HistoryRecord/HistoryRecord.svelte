<script lang="ts">
	import { fade, fly } from 'svelte/transition'
	import { spring } from 'svelte/motion'
	import { DateTime } from 'luxon'
	import type { RecordWithCounterAndLabel } from '@/@types/api/records'
	import { Icon } from '@/components/commons'
	import { drag } from '@/actions/drag'

	export let record: RecordWithCounterAndLabel
	export let index: number

	let coords = spring({ x: 0 }, { stiffness: 0.05, damping: 0.5 })
	let isDragged: boolean = false
	let width: number

	$: recordDate = DateTime.fromJSDate(new Date(record.createdAt))
	$: if ($coords.x * -1 >= 70 && !isDragged) {
		// TODO: call delete record api
	}
	$: maxDragCoords = Math.max($coords.x, -70)

	function handleSlideStart() {
		coords.stiffness = coords.damping = 1
		coords.set($coords)
		isDragged = true
	}

	function handleSlideMove(event: CustomEvent<{ dx: number; dy: number }>) {
		if (event.detail.dx < 0) {
			coords.update(($coords) => ({
				x: $coords.x + event.detail.dx,
			}))
		} else if ($coords.x < 0 && $coords.x + event.detail.dx < 0) {
			coords.update(($coords) => ({
				x: $coords.x + event.detail.dx,
			}))
		}
	}

	function handleSlideEnd() {
		coords.stiffness = 0.05
		coords.damping = 0.5
		coords.set({ x: 0 })
		isDragged = false
	}
</script>

<div class="relative mb-3 overflow-x-hidden" bind:offsetWidth={width}>
	<!-- DELETE ICON LAYER-->
	<div class="absolute left-full top-0 bottom-0 z-30 flex items-center">
		<div
			class="aspect-square rounded-full bg-red-400 p-1 text-white"
			style="transform: translate3d({maxDragCoords}px, 0, 0); opacity: {(maxDragCoords * -1) / 70}"
		>
			<Icon.Cross />
		</div>
	</div>

	<!-- DRAGGABLE AREA -->
	<div
		use:drag
		on:dragstart={() => {
			handleSlideStart()
		}}
		on:dragmove={handleSlideMove}
		on:dragend={handleSlideEnd}
		class="absolute top-0 bottom-0 right-0 z-30 w-12 hover:cursor-grab active:cursor-grabbing"
	/>
	
	<!-- CONTENT LAYER -->
	<div
		class="relative z-20 grid select-none grid-cols-[100px_1fr] bg-white px-3 py-2"
		style="transform: translate3d({maxDragCoords}px, 0, 0)"
	>
		<p class="whitespace-nowrap text-sm font-bold" transition:fade>
			{recordDate.toFormat('h:mm a')}
		</p>
		<div class="w-full space-y-3" in:fly={{ x: 200, delay: index * 50 }} out:fade>
			<div
				class="w-max whitespace-nowrap rounded-md px-2 py-0.5 text-sm text-white"
				style="background-color: {record.counter.color}"
			>
				+{record.increment}
				{record.counter.title}
			</div>

			<div class="text-sm">
				{record.description}
			</div>

			<div class="flex flex-wrap gap-1 text-sm">
				{#each record.labels as label (label.id)}
					<span class="rounded-full border-2 border-gray-400 py-0.5 px-3 text-gray-400"
						>{label.value}</span
					>
				{/each}
			</div>
		</div>
	</div>
</div>
