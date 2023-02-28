<script>
	import Button from '@/components/commons/Button/Button.svelte';
	import { Routes } from '@/utils/routes'
</script>

<div class="container mx-auto min-h-screen pt-9">
	<h1 class="sticky top-0 z-30 bg-white py-3  text-center text-4xl">WAICH</h1>

  <div class='flex justify-center pt-6'>
    <a href={Routes.GITHUB_AUTHORIZATION}>
      <Button>Login to Github</Button>
    </a>
  </div>
</div>
