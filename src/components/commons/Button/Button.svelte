<script lang="ts">
	import { type IButtonColor, ButtonColor } from './types';

	export let color: IButtonColor = 'default';
	export let block = false;
</script>

{#if color === ButtonColor.PRIMARY}
	<button
		on:click
		class="hover:text-white' rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-bold transition-colors marker:text-blue-100 hover:bg-blue-700"
		class:w-full={block}
	>
		<slot />
	</button>
{:else}
	<button
		on:click
		class="font-bold text-sm text-center px-4 py-3 rounded-lg transition-colors text-gray-400 bg-gray-200 hover:bg-gray-300 hover:text-black"
		class:w-full={block}
	>
		<slot />
	</button>
{/if}
