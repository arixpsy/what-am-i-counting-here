<script lang="ts">
	import { goto } from '$app/navigation'
	import { Button, NavigationItem, Icon } from '@/components/commons'
	import { Routes } from '@/utils/routes'
</script>

<div class="container mx-auto min-h-screen pt-9">
	<!-- HEADER -->
	<h1 class="sticky top-0 z-10 bg-white py-3  text-center text-4xl">
		<p>Options</p>
	</h1>

	<div class="mx-auto mb-24 flex w-full max-w-lg flex-col py-3">
		<a href={Routes.LOGOUT} class="block px-3">
			<Button block>Logout</Button>
		</a>
	</div>

	<!-- NAVIGATION TO HOME-->
	<div class="fixed bottom-6 right-6 z-30 space-y-6">
		<NavigationItem icon={Icon.Home} ariaLabel="navigate home" on:click={() => goto(Routes.HOME)} />
	</div>
</div>
