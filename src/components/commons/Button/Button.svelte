<script lang="ts">
	import { Loader } from '@/components/commons'
	import { type IButtonColor, ButtonColor } from './types'

	export let color: IButtonColor = 'default'
	export let block = false
	export let isLoading = false
</script>

<button
	on:click
	class="hover:text relative rounded-lg px-4 py-3 text-center text-sm font-bold transition-colors"
	class:w-full={block}
	class:primary={color === ButtonColor.PRIMARY}
	class:cursor-not-allowed={isLoading}
>
	<div class:invisible={isLoading}>
		<slot />
	</div>
	<div class="absolute inset-0 grid place-items-center" class:invisible={!isLoading}>
		<Loader size="xs" color="inherit" />
	</div>
</button>

<style>
	button {
		@apply bg-gray-200;
		@apply text-gray-400;
	}

	button:hover {
		@apply bg-gray-300;
		@apply text-gray-600;
	}

	button.primary {
		@apply bg-blue-600;
		@apply text-blue-100;
	}

	button.primary:hover {
		@apply bg-blue-700;
		@apply text-white;
	}
</style>
