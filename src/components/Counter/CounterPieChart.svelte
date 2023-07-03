<script lang="ts">
	import { onMount } from 'svelte'
	import * as d3 from 'd3'
	import { fade } from 'svelte/transition'

	export let data: Array<[string, number]>
	export let colorScale: d3.ScaleOrdinal<string, unknown, never> = d3
		.scaleOrdinal()
		.range(d3.schemePastel1)

	let clientWidth: number
	let chartContainerElement: HTMLDivElement
	let chartSelection: d3.Selection<SVGGElement, unknown, null, undefined>
	let pieArc: d3.Arc<any, d3.DefaultArcObject>
	let hasMounted = false

	$: if (data && hasMounted) {
		render()
	}

	function render() {
		const pie = d3.pie().value((d: any) => d[1])
		const pieData = pie(data as unknown as (number | { valueOf(): number })[])

		chartSelection
			.selectAll('path')
			.data(pieData)
			.join('path')
			.attr('d', pieArc as unknown as string)
			.attr('fill', (d: any) => colorScale(d.data[0]) as string)
			.attr('stroke', 'white')
			.style('stroke-width', '2px')
			.style('scale', 0)
			.style('opacity', 0)
			.transition()
			.duration(250)
			.style('scale', 1)
			.style('opacity', 1)
	}

	onMount(() => {
		const width = clientWidth / 2
		const height = clientWidth / 2
		const margin = 15
		const radius = Math.min(width, height) / 2 - margin

		chartSelection = d3
			.select(chartContainerElement)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${width / 2}, ${height / 2})`)

		pieArc = d3.arc().innerRadius(0).outerRadius(radius)

		hasMounted = true
	})
</script>

<div
	bind:this={chartContainerElement}
	class="relative flex max-w-lg justify-center"
	bind:clientWidth
/>

<div class="flex flex-wrap justify-center gap-x-3 gap-y-1 px-3">
	{#each data as [category] (category)}
		{@const color = `${colorScale(category)}`}
		<div class="flex items-center gap-1" in:fade>
			<div class="h-3 w-3 rounded-full" style:background={color} />
			<p class="text-sm">{category || 'Others'}</p>
		</div>
	{/each}
</div>
