<script>
	import { browser } from '$app/environment'
	import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query'
	import '../app.css'

	const client = new QueryClient({
		defaultOptions: {
			queries:  {
				enabled: browser,
				refetchOnWindowFocus: false
			}
		}
	})
</script>

<QueryClientProvider {client}>
	<main class="min-h-screen bg-white">
		<slot />
	</main>
</QueryClientProvider>
