<script lang="ts">
	import { fetchCoffee, IDLE_TIMEOUT, type Coffee } from '$lib';
	import { fade } from 'svelte/transition';
	import Card from './Card.svelte';

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

	addCoffee();
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
	<button class="add-button" onclick={addCoffee} disabled={isLoading}>+</button>
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

	// proudly borrowed this button
	// from svelte tutorial
	.add-button {
		font-size: 1.4em;
		width: 6em;
		height: 6em;
		border-radius: 50%;
		background: radial-gradient(circle at 25% 25%, var(--red-secondary) 0, var(--red-primary) 100%);
		box-shadow:
			0 8px 0 var(--red-secondary),
			2px 12px 10px rgba(0, 0, 0, 0.35);
		color: var(--accent-foreground);
		text-shadow:
			-1px -1px 2px rgba(0, 0, 0, 0.3),
			1px 1px 2px rgba(255, 255, 255, 0.4);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-size: 1rem;
		line-height: 1rem;
		transform: translate(0, -8px);
		transition: all 0.2s;

		&:active {
			transform: translate(0, -2px);
			box-shadow:
				0 2px 0 var(--red-secondary),
				2px 6px 10px rgba(0, 0, 0, 0.35);
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
