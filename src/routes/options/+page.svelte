<script>

	import Button from "@/components/commons/Button/Button.svelte"
import { Routes } from "@/utils/routes"

</script>
<div class="container mx-auto min-h-screen pt-9">
	<!-- HEADER -->
	<h1 class="sticky top-0 z-10 bg-white py-3  text-center text-4xl">
		<p>Options</p>
	</h1>

  <a href={Routes.LOGOUT} class='block px-3'>
		<Button block>Logout</Button>
	</a>
</div>
