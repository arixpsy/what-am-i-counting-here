<script lang="ts">
	import { page } from '$app/stores'
	import { Button } from '@/components/commons/'
	import { Routes } from '@/utils/routes'
</script>

<div class="container mx-auto min-h-screen pt-9">
	<!-- HEADER -->
	<h1 class="sticky top-0 z-10 bg-white py-3  text-center text-4xl">
		<p>WAICH</p>
	</h1>

	{#if $page.data.user}
		Welcome {$page.data.user.displayName}
	{/if}

	<a href={Routes.LOGOUT}>
		<Button>Logout</Button>
	</a>
</div>

<!-- MODALS -->