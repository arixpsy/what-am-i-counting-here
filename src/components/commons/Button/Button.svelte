<script lang="ts">
	import { type IButtonColor, ButtonColor } from './types'

	export let color: IButtonColor = 'default'
	export let block = false
</script>

{#if color === ButtonColor.PRIMARY}
	<button
		on:click
		class="rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-bold text-blue-100 transition-colors marker:text-blue-100 hover:bg-blue-700 hover:text-white"
		class:w-full={block}
	>
		<slot />
	</button>
{:else}
	<button
		on:click
		class="rounded-lg bg-gray-200 px-4 py-3 text-center text-sm font-bold text-gray-400 transition-colors hover:bg-gray-300 hover:text-gray-600"
		class:w-full={block}
	>
		<slot />
	</button>
{/if}
