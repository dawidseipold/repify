<script lang="ts">
	import { writable } from 'svelte/store';

	import { Select } from 'bits-ui';
	import { Check } from 'lucide-svelte';

	const FORMULAS = [
		{
			value: 'brzycki',
			label: 'Brzycki',
			formula: (weight: number, reps: number) => weight * (36 / (37 - reps))
		},
		{
			value: 'epley',
			label: 'Epley',
			formula: (weight: number, reps: number) => weight * (1 + reps / 30)
		},
		{
			value: 'lander',
			label: 'Lander',
			formula: (weight: number, reps: number) => (100 * weight) / (101.3 - 2.67123 * reps)
		},
		{
			value: 'lombardi',
			label: 'Lombardi',
			formula: (weight: number, reps: number) => weight * Math.pow(reps, 0.1)
		},
		{
			value: 'mayhew',
			label: 'Mayhew',
			formula: (weight: number, reps: number) =>
				(100 * weight) / (52.2 + 41.9 * Math.exp(-0.055 * reps))
		},
		{
			value: 'oconner',
			label: "O'Conner",
			formula: (weight: number, reps: number) => weight * (1 + 0.025 * reps)
		},
		{
			value: 'wathan',
			label: 'Wathan',
			formula: (weight: number, reps: number) =>
				(100 * weight) / (48.8 + 53.8 * Math.exp(-0.075 * reps))
		}
	];

	let formula = writable(FORMULAS[0]);
	let weight = writable(NaN);
	let reps = writable(NaN);

	let result = writable(0);
</script>

<form
	on:submit={(e) => {
		e.preventDefault();
		result.set(Math.ceil($formula.formula($weight, $reps) * 20) / 20);
	}}
>
	<Select.Root
		items={FORMULAS}
		onSelectedChange={(value) =>
			formula.set(FORMULAS.find((formula) => formula.value === value?.value) || FORMULAS[0])}
	>
		<Select.Trigger>
			<Select.Value />
			formula
		</Select.Trigger>

		<Select.Content>
			{#each FORMULAS as formula}
				<Select.Item value={formula.value} label={formula.label}>
					{formula.label}

					<Select.ItemIndicator>
						<Check />
					</Select.ItemIndicator>
				</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>

	<input type="number" placeholder="Weight" bind:value={$weight} />
	<input type="number" placeholder="Reps" bind:value={$reps} />

	<button type="submit">Calculate</button>

	{#if $result}
		<p>{$result}</p>
	{/if}
</form>
