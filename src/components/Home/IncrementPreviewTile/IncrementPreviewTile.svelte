<script lang="ts">
	import { Icon } from '@/components/commons'
	import { formatCount } from '@/utils/format'
	import type { GetCounterResponse } from '@/@types/api/counters'

	export let counter: GetCounterResponse | undefined = undefined
	export let increment: number
</script>

<div
	class="flex aspect-square w-full max-w-xs flex-col items-center justify-center self-center rounded-lg p-2"
	style="background-color: {counter?.color}"
>
	<p class="w-full truncate text-center text-3xl text-gray-100">
		{counter?.title}
	</p>
	<p class="my-3 flex flex-wrap items-center justify-center space-x-3 text-3xl font-bold">
		<span class="line-through">{formatCount(counter?.currentCount || 0)}</span>
		<Icon.ChevronRight />
		<span>{formatCount((counter?.currentCount || 0) + increment)}</span>
	</p>
</div>
