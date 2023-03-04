<script>
	import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query'
	import '../app.css'

	const client = new QueryClient({
		defaultOptions: {
			queries:  {
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
