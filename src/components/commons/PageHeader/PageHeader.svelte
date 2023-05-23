<script lang="ts">
	import { fade } from 'svelte/transition'

	let scrollY: number
  
</script>

<svelte:window bind:scrollY />

<h1
	class="sticky top-0 z-30 bg-white py-3 text-center text-4xl"
	class:shadow-lg={scrollY > 36}
	in:fade
>
	<slot />
</h1>
