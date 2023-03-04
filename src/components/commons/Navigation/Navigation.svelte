<script lang="ts">
	import { tick } from 'svelte'
	import { Icon } from '@/components/commons'
	import NavigationItem from '@/components/commons/NavigationItem/NavigationItem.svelte'

	export let isMenuOpen: boolean = false
	export let navigationItems: Array<{
		icon: (typeof Icon)[keyof typeof Icon]
		onClick: () => void
		label: string
	}> = []

	const navButtonRefs: Array<HTMLButtonElement> = []

	$: if (isMenuOpen) {
		focusFirstItem()
	}

	async function focusFirstItem() {
		await tick()
		navButtonRefs[0].focus()
	}
</script>

<div class="fixed bottom-6 right-6 space-y-6">
	<!-- Navigation Menu Items -->
	{#if isMenuOpen}
		{#each navigationItems as item, index (index)}
			<NavigationItem
				inFly={{ x: 100, delay: (navigationItems.length - index) * 100 }}
				outFly={{ x: 100, delay: index * 100 }}
				icon={item.icon}
				bind:ref={navButtonRefs[index]}
				ariaLabel={item.label}
				on:click={item.onClick}
			/>
		{/each}
	{/if}

	<!-- Navigation Menu Button -->
	<NavigationItem
		icon={isMenuOpen ? Icon.Cross : Icon.Burger}
		ariaLabel="navigation menu"
		on:click={() => (isMenuOpen = !isMenuOpen)}
		isClose={isMenuOpen}
	/>
</div>
