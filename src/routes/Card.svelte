<script lang="ts">
	import type { Coffee } from '$lib';
	import Image from './Image.svelte';
	import Notes from './Notes.svelte';
	interface Props {
		item: Coffee;
	}
	const { item }: Props = $props();
</script>

<div class="card">
	<!-- https://random-data-api.com/api/coffee/random_coffee link from example looks a little bit broken
    and always returns same image, so I changed it, and now we see a pictures of cats istead of coffee
    looks like decent trade for me -->
	<Image src="https://loremflickr.com/500/500/?random={Math.random()}" />
	<div class="card-content">
		<p class="origin">{item.origin}</p>
		<p class="blend">{item.blend_name}</p>
		<p class="variety">{item.variety}</p>
		<Notes notes={item.notes} />
	</div>
</div>

<style lang="less">
	.card {
		max-width: 300px;

		// for nice rounded cornes for image
		overflow: hidden;

		background-color: var(--secondary);
		color: var(--secondary-foreground);

		border: 2px solid var(--border);
		border-radius: 1rem;

		// we definitly not need to nest seletors here like that
		// but i want to use something from less syntax :)
		& .card-content {
			padding: 1rem;
		}

		// this is shorthand for & .class
		.origin {
			color: var(--muted-foreground);
		}
	}

	// but as all selectors already made local
	// it's better to use simple selectors
	// like here
	.blend {
		font-size: 1.5em;
		color: var(--accent-foreground);
		font-weight: 600;
	}
</style>
