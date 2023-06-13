<script lang="ts">
	import { onMount } from 'svelte'
	import * as d3 from 'd3'

	export let data: Array<[string, number]>
	export let colorScale: d3.ScaleOrdinal<string, unknown, never> = d3
		.scaleOrdinal()
		.range(d3.schemePastel1)

	let clientWidth: number
	let chartContainerElement: HTMLDivElement

	onMount(() => {
		const width = clientWidth / 1.5
		const height = clientWidth / 1.5
		const margin = 30
		const radius = Math.min(width, height) / 2 - margin

		// append the svg object to the div called 'my_dataviz'
		const svg = d3
			.select(chartContainerElement)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${width / 2}, ${height / 2})`)

		const pie = d3.pie().value((d) => d[1])
		const data_ready = pie(data)
		const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius)

		svg
			.selectAll('mySlices')
			.data(data_ready)
			.join('path')
			.attr('d', arcGenerator)
			.attr('fill', function (d) {
				return colorScale(d.data[0])
			})
			.attr('stroke', 'white')
			.style('stroke-width', '2px')
			.style('opacity', 0.7)
	})
</script>

<div bind:this={chartContainerElement} class="relative flex max-w-lg justify-center" bind:clientWidth />

<div>
	{#each data as entry}
		{@const color = colorScale(entry[0])}
		<div style:background={color}>
			<p>{entry[0] || 'Others'}</p>
		</div>
	{/each}
</div>
