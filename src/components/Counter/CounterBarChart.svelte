<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte'
	import * as d3 from 'd3'
	import { DateTime } from 'luxon'
	import colors from 'tailwindcss/colors'
	import type { RecordsInChartFormat } from '@/@types/client/records'
	import { accumulateRecordIncrements } from '@/utils/counters'
	import type { Counter, Record } from '@prisma/client'
	import { CounterBarChartXAxisLabel } from '@/utils/chart'

	export let color: string
	export let data: RecordsInChartFormat
	export let counter: Counter
	export let selectedIndex: number

	let numOfRecords = data.length
	let chartLayerElement: SVGSVGElement
	let fixedAxisLayerElement: SVGSVGElement
	let bars: d3.Selection<
		d3.BaseType | SVGRectElement,
		{
			index: number
			start: number
			end: number
			data: Record[]
		},
		SVGGElement,
		unknown
	>
	let xScale: d3.ScaleLinear<number, number, never>
	let yScale: d3.ScaleLinear<number, number, never>
	let hasMounted = false

	const CHART_HEIGHT = 300
	const CHART_WIDTH = numOfRecords * 60
	const PADDING = {
		TOP: 25,
		BOTTOM: 25,
		LEFT: 40,
		RIGHT: 20,
	}
	const X_OFFSET_AXIS = 22
	const X_OFFSET_BAR = 12
	const BAR_WIDTH = 20
	const dispatch = createEventDispatcher<{
		selectIndex: number
	}>()

	$: if (selectedIndex && bars && hasMounted) {
		render()
	}

	function render() {
		d3.select(chartLayerElement)
			.selectAll('rect')
			.data(data)
			.join('rect')
			.transition()
			.duration(750)
			.attr('y', (v) => yScale(accumulateRecordIncrements(v.data)))
			.attr(
				'height',
				(v) =>
					CHART_HEIGHT - PADDING.TOP - PADDING.BOTTOM - yScale(accumulateRecordIncrements(v.data))
			)
			.duration(350)
			.attr('fill', (v) => (v.index === selectedIndex ? color : colors.gray[300]))
	}

	onMount(() => {
		let maxY = d3.max(data.flatMap((i) => accumulateRecordIncrements(i.data)))

		xScale = d3
			.scaleLinear()
			.domain([0, numOfRecords - 1])
			.range([0, CHART_WIDTH - PADDING.LEFT - PADDING.RIGHT])

		yScale = d3
			.scaleLinear()
			.domain([0, maxY || 0])
			.range([CHART_HEIGHT - PADDING.BOTTOM - PADDING.TOP, 0])

		const chartLayer = d3
			.select(chartLayerElement)
			.attr('height', CHART_HEIGHT)
			.attr('width', CHART_WIDTH)
			.style('margin-left', PADDING.LEFT)
			.style('margin-right', PADDING.RIGHT)

		const fixedAxisLayer = d3
			.select(fixedAxisLayerElement)
			.attr('height', CHART_HEIGHT)
			.attr('width', '100%')
			.style('position', 'absolute')
			.style('inset', 0)
			.style('pointer-events', 'none')

		// Bars
		bars = chartLayer
			.append('g')
			.selectAll('rect')
			.data(data)
			.join('rect')
			.attr('width', BAR_WIDTH)
			.attr('height', 0)
			.attr('x', (v) => xScale(v.index))
			.attr('y', yScale(0))
			.attr('rx', 5)
			.attr('fill', (v) => (v.index === selectedIndex ? color : '#e8e8e8'))
			.attr('transform', `translate(${X_OFFSET_BAR}, ${PADDING.TOP})`)
			.on('click', (_, t) => dispatch('selectIndex', t.index))
			.style('cursor', 'pointer')

		// X Axis
		chartLayer
			.append('g')
			.call(
				d3
					.axisBottom(xScale)
					.ticks(numOfRecords)
					.tickFormat((v, i) =>
						CounterBarChartXAxisLabel(
							DateTime.fromSeconds(data[v.valueOf()].start),
							counter.resetType,
							i === numOfRecords - 1
						)
					)
			)
			.call((g) => g.select('.domain').remove())
			.call((g) => g.selectAll('.tick line').remove())
			.call((g) => g.selectAll('text').attr('color', colors.gray[400]))
			.attr('transform', `translate(${X_OFFSET_AXIS}, ${CHART_HEIGHT - PADDING.TOP})`)

		// Y Axis
		fixedAxisLayer
			.append('g')
			.call(d3.axisLeft(yScale).ticks(6))
			.call((g) => g.select('.domain').remove())
			.call((g) => g.selectAll('.tick line').remove())
			.call((g) =>
				g
					.selectAll('text')
					.attr('text-anchor', 'start')
					.attr('transform', 'translate(0, -5)')
					.attr('color', colors.gray[400])
					.attr('font-size', '0.725em')
			)
			.attr('transform', `translate(${PADDING.LEFT}, ${PADDING.TOP})`)

		hasMounted = true
		render()
	})
</script>

<div class="relative m-auto max-w-lg overflow-x-auto" dir="rtl">
	<svg bind:this={fixedAxisLayerElement} />
	<div class="hide-scrollbar overflow-x-auto" style:margin-left={`${PADDING.LEFT}px`}>
		<svg bind:this={chartLayerElement} />
	</div>
</div>

<style>
	.hide-scrollbar::-webkit-scrollbar {
		display: none;
	}
</style>
