<script lang='ts'>
	import { onMount } from 'svelte'
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query'
	import { pwaInfo } from 'virtual:pwa-info';
	import '../app.css'

	let ReloadPrompt: ConstructorOfATypedSvelteComponent

	$: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : ''

	onMount(async () => {
    pwaInfo && (ReloadPrompt = (await import('@/components/commons/ReloadPrompt/ReloadPrompt.svelte')).default)
  })

	const client = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: false,
				refetchOnWindowFocus: false,
			},
		},
	})
</script>

<svelte:head>
	{@html webManifest}
</svelte:head>

<QueryClientProvider {client}>
	<main class="min-h-screen bg-white">
		<slot />
	</main>
</QueryClientProvider>

{#if !!ReloadPrompt}
  <svelte:component this={ReloadPrompt} />
{/if}
