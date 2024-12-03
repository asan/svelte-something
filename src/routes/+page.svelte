<script lang="ts">
	import { fetchCoffee, IDLE_TIMEOUT, type Coffee } from '$lib';
	import { fade } from 'svelte/transition';
	import Card from './Card.svelte';
	import { onMount } from 'svelte';
	import Plus from './Plus.svelte';

	const collection: Coffee[] = $state([]);

	let isLoading = $state(false);
	let lastError: string | null = $state(null);
	async function addCoffee() {
		// this function may be called from effect
		// so it's not enough to just disable button
		if (isLoading) return;

		// not a big fan of this pattern because it
		// very verbose and had too much possible
		// invalid states if you forget to set loading
		// or clear error
		// looks like async block can solve this
		lastError = null;
		isLoading = true;
		try {
			const coffee = await fetchCoffee();
			collection.push(coffee);
			setTimeout(() => scrollToBottom(), 10);
		} catch (e: any) {
			lastError = e.toString();
		} finally {
			isLoading = false;
		}
	}

	// we have a trade off here:
	// either it can take up to 2 IDLE_TIMEOUT in worst case
	// before card would be added after user interaction
	// or we need to constantly add / remove interval
	// after any user interaction
	// I selected first one because it should be
	// more performant on low end devices
	let lastInteractionTime = $state(Date.now());
	function onInteraction() {
		lastInteractionTime = Date.now();
	}
	$effect(() => {
		const intervalId = setInterval(() => {
			if (Date.now() - lastInteractionTime >= IDLE_TIMEOUT) {
				addCoffee();
			}
		}, IDLE_TIMEOUT);
		return () => {
			clearInterval(intervalId);
		};
	});

	onMount(() => {
		addCoffee();
	});

	function scrollToBottom() {
		window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
	}
</script>

<!-- here we are deciding what is considered user interaction  -->
<!-- in my opinion mousemove and touchstart is enough for demo purpose   -->
<main onmousemove={onInteraction} ontouchstart={onInteraction}>
	{#if lastError}
		<div class="error" transition:fade>
			{lastError}
		</div>
	{/if}
	<button
		class="dark"
		onclick={() => {
			// at first i tried to make it through
			// reactive variable and class binding
			// but it broke app in some weird way
			// so this is looks like most ideomatic
			// way to work with dark theme
			document.body.classList.toggle('dark');
		}}
	>
		🌚
	</button>
	{#each collection as item (item.id)}
		<Card {item} />
	{/each}
	<button class="add-button" onclick={addCoffee} disabled={isLoading}><Plus /></button>
</main>

<style lang="less">
	:global {
		@layer base;
		@import (css) '$lib/reset.css';
		@import (css) '$lib/theme.css';
	}

	main {
		min-height: 100dvh;
		width: 100%;
		background-color: var(--background);
		color: var(--foreground);
		padding: 1rem;

		// it's always better to manage
		// layout in parent elements
		// not in children
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.add-button {
		width: 100px;
		height: 100px;

		border-radius: 50%;
		border: 0;

		background: transparent;
		color: var(--red-primary);

		&:active {
			color: var(--red-secondary);
		}

		&:disabled {
			filter: grayscale(1);
		}
	}

	.error {
		position: sticky;
		top: 1rem;
		padding: 0.5rem 4rem;

		background-color: var(--red-secondary);
		border: 2px solid var(--red-primary);
		border-radius: 1rem;
	}

	.dark {
		position: fixed;
		bottom: 1rem;
		right: 1rem;

		background-color: transparent;
		border: 1px solid var(--border);
		border-radius: 1rem;
	}
</style>
