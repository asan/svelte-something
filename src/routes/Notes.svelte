<script lang="ts">
	interface Props {
		notes: string;
	}
	const { notes }: Props = $props();
	function pickColor(i: number) {
		const colorClasses = [
			'red-primary',
			'red-secondary',
			'orange-primary',
			'orange-secondary',
			'yellow-primary',
			'yellow-secondary',
			'green-primary',
			'green-secondary',
			'cyan-primary',
			'cyan-secondary',
			'blue-primary',
			'blue-secondary',
			'purple-primary',
			'purple-secondary',
			'magenta-primary',
			'magenta-secondary'
		];
		return colorClasses[i % colorClasses.length];
	}
</script>

<div class="notes">
	{#each notes.split(', ') as note, i}
		<span class="note {pickColor(i)}">{note}</span>
	{/each}
</div>

<style lang="less">
	.notes {
		overflow-x: auto;
		text-wrap: nowrap;
		padding-bottom: 1rem;
		line-height: 2.5rem;
	}

	.note {
		padding: 0.25rem 2rem;
		margin: 0.25rem;
		border-radius: 0.25rem;
	}

	.red-primary {
		background: var(--red-primary);
	}
	.red-secondary {
		background: var(--red-secondary);
	}
	.orange-primary {
		background: var(--orange-primary);
	}
	.orange-secondary {
		background: var(--orange-secondary);
	}
	.yellow-primary {
		background: var(--yellow-primary);
	}
	.yellow-secondary {
		background: var(--yellow-secondary);
	}
	.green-primary {
		background: var(--green-primary);
	}
	.green-secondary {
		background: var(--green-secondary);
	}
	.cyan-primary {
		background: var(--cyan-primary);
	}
	.cyan-secondary {
		background: var(--cyan-secondary);
	}
	.blue-primary {
		background: var(--blue-primary);
	}
	.blue-secondary {
		background: var(--blue-secondary);
	}
	.purple-primary {
		background: var(--purple-primary);
	}
	.purple-secondary {
		background: var(--purple-secondary);
	}
	.magenta-primary {
		background: var(--magenta-primary);
	}
	.magenta-secondary {
		background: var(--magenta-secondary);
	}
</style>
