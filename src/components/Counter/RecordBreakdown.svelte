<script lang="ts">
	import type { RecordWithCounterAndLabel } from '@/@types/api/records'
	import { CounterPieChart } from '@/components/Counter'

	export let records: Array<RecordWithCounterAndLabel>

	$: labelToRecordMap = convertCounterRecordsToLabelMap(records)
	$: labelToSizeEntries = Object.entries(Object.fromEntries(labelToRecordMap)).map(
		([cat, records]) => [cat, records.length] as [string, number]
	)

	function convertCounterRecordsToLabelMap(
		records: Array<RecordWithCounterAndLabel>
	): Map<string, Array<RecordWithCounterAndLabel>> {
		let labelGroups = new Map<string, Array<RecordWithCounterAndLabel>>()

		for (const record of records) {
			const key = record.labels
				.map((l) => l.value)
				.sort()
				.toString()
			let value
			if (labelGroups.has(key)) {
				value = [...(labelGroups.get(key) || []), record]
			} else {
				value = [record]
			}
			labelGroups.set(key, value)
		}

		return labelGroups
	}
</script>

<div class="relative m-auto mt-6 max-w-lg">
	<h1 class="text-center text-lg">Record Breakdown</h1>
	<CounterPieChart data={labelToSizeEntries} />
</div>
