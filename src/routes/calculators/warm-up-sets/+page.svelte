<script lang="ts">
	import { Select } from 'bits-ui';
	import { Check } from 'lucide-svelte';
	import { afterUpdate } from 'svelte';
	import { writable } from 'svelte/store';

	type WarmupSet = {
		reps: number;
		weight: number;
	};

	let weight = writable(NaN);

	let warmupSets = writable([
		{
			reps: 10,
			weight: 20
		},
		{
			reps: 8,
			weight: NaN
		},
		{
			reps: 5,
			weight: NaN
		},
		{
			reps: 3,
			weight: NaN
		},
		{
			reps: 1,
			weight: NaN
		}
	] as WarmupSet[]);

	function calculateWarmupSets(weight: number, warmupSets: WarmupSet[]) {
		const percentages = [0.4, 0.7, 0.85, 0.925];

		for (let [index, set] of warmupSets.entries()) {
			if (isNaN(set.weight)) {
				set.weight = Math.ceil(weight * percentages[index - 1]);

				console.log(index);
			}
		}

		return warmupSets;
	}

	afterUpdate(() => {
		console.log($warmupSets);
	});
</script>

<form
	on:submit={(e) => {
		e.preventDefault();
		warmupSets.set(calculateWarmupSets($weight, $warmupSets));
	}}
>
	<input type="number" placeholder="Weight" bind:value={$weight} />

	<button type="submit">Calculate</button>
</form>

{#if $warmupSets.filter((set) => isNaN(set.weight)).length < 1}
	{#each $warmupSets as warmupSet}
		<p>{warmupSet.weight} x {warmupSet.reps}</p>
	{/each}
{/if}
