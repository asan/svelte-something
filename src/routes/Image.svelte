<script lang="ts">
	import { PLACEHOLDER_DATAURI } from '$lib/constants';
	import { onMount } from 'svelte';
	interface Props {
		src: string;
		width?: number;
		height?: number;
	}
	const { src, width = 500, height = 500 }: Props = $props();

	let imgSrc = $state(PLACEHOLDER_DATAURI);

	onMount(() => {
		const img = new Image();
		img.src = src;
		img.onload = () => {
			// we of course can read image data as base64 or blob
			// and use that in our final image, but as browser
			// already cached this image this would also work
			// almost istantly
			imgSrc = src;
		};
	});
</script>

<img src={imgSrc} {width} {height} alt="" />

<style lang="less">
	img {
		object-fit: cover;
	}
</style>
