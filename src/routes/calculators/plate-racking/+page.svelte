<script lang="ts">
	import { Select } from 'bits-ui';
	import { afterUpdate } from 'svelte';
	import { writable } from 'svelte/store';

	type Plate = {
		weight: number;
		count: number;
	};

	type Barbell = {
		value: string;
		label: string;
		weight: number;
	};

	let availablePlates = writable([
		{ weight: 25, count: 0 },
		{ weight: 20, count: 0 },
		{ weight: 15, count: 0 },
		{ weight: 10, count: 0 },
		{ weight: 5, count: 0 },
		{ weight: 2.5, count: 0 },
		{ weight: 1.25, count: 0 },
		{ weight: 1, count: 0 },
		{ weight: 0.5, count: 0 },
		{ weight: 0.25, count: 0 }
	] as Plate[]);

	let BARBELLS = writable([
		{ value: 'standard', label: 'Standard', weight: 20 },
		{ value: 'trap', label: 'Trap', weight: 25 }
	] as Barbell[]);

	let selectedBarbell = writable($BARBELLS[0]);
	let weight = writable(NaN as number);
	let platesToLoad = writable([] as Plate[]);

	let newBarbell = writable({ name: '', weight: NaN });
	let newPlate = writable({ weight: NaN, count: 0 });

	afterUpdate(() => {
		console.log($platesToLoad);
	});

	function calculatePlates(weight: number, selectedBarbell: Barbell, availablePlates: Plate[]) {
		if (availablePlates.every((plate) => plate.count === 0)) {
			return [];
		}

		if (
			selectedBarbell.weight +
				availablePlates.reduce((acc, plate) => acc + plate.weight * plate.count, 0) <
			weight
		) {
			return [];
		}

		let remainingWeight = weight - selectedBarbell.weight;
		const usablePlates = availablePlates.filter((plate) => plate.count > 1);

		const platesToLoad = [] as Plate[];

		for (let plate of usablePlates) {
			console.log(plate);

			while (plate.weight * 2 <= remainingWeight) {
				if (platesToLoad.some((p) => p.weight === plate.weight)) {
					const index = platesToLoad.findIndex((p) => p.weight === plate.weight);

					platesToLoad[index].count += 1;
				} else {
					platesToLoad.push({ weight: plate.weight, count: 1 });
				}

				remainingWeight -= plate.weight * 2;
			}
		}

		if (
			platesToLoad.reduce((acc, plate) => acc + plate.weight * plate.count * 2, 0) <
			weight - selectedBarbell.weight
		) {
			console.log('Not enough plates');
		}

		return platesToLoad;
	}
</script>

<form
	on:submit={(e) => {
		e.preventDefault();

		if ($newBarbell.name === '' || isNaN($newBarbell.weight)) {
			return;
		}

		BARBELLS.update((barbells) => {
			return [
				...barbells,
				{
					value: $newBarbell.name.toLowerCase().replace(' ', '-'),
					label: $newBarbell.name,
					weight: $newBarbell.weight
				}
			];
		});

		newBarbell.set({ name: '', weight: NaN });
	}}
>
	<input
		type="text"
		placeholder="Barbell name"
		bind:value={$newBarbell.name}
		name="name"
		id="name"
	/>
	<input
		type="number"
		placeholder="Barbell weight"
		bind:value={$newBarbell.weight}
		name="weight"
		id="weight"
	/>

	<button type="submit">Add Barbell</button>
</form>

<form
	on:submit={() => {
		if (isNaN($newPlate.weight) || $newPlate.count === 0) {
			return;
		}

		if ($availablePlates.some((plate) => plate.weight === $newPlate.weight)) {
			return;
		}

		availablePlates.update((availablePlates) => {
			return [
				...availablePlates,
				{
					weight: $newPlate.weight,
					count: $newPlate.count
				}
			];
		});

		newPlate.set({ weight: NaN, count: 0 });
	}}
>
	<input type="number" step=".01" placeholder="Weight" bind:value={$newPlate.weight} />
	<input type="number" step="1" placeholder="Count" bind:value={$newPlate.count} />
	<button type="submit">Add Plate</button>
</form>

<form
	on:submit={() => {
		platesToLoad.set(calculatePlates($weight, $selectedBarbell, $availablePlates));
	}}
>
	<Select.Root
		items={$BARBELLS}
		onSelectedChange={(value) => {
			selectedBarbell.set(
				$BARBELLS.find((barbell) => barbell.value === value?.value) || $BARBELLS[0]
			);
		}}
	>
		<Select.Trigger>
			<Select.Value />
			barbell
		</Select.Trigger>

		<Select.Content>
			{#each $BARBELLS as barbell}
				<Select.Item value={barbell.value}>{barbell.label}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>

	<input type="number" step=".01" placeholder="Weight" bind:value={$weight} />

	<button type="submit">Calculate</button>
</form>

{#if $availablePlates.length > 0}
	<ul>
		{#each $availablePlates.sort((a, b) => b.weight - a.weight) as plate}
			<li>
				<input
					type="number"
					min="0"
					step="1"
					bind:value={plate.count}
					on:change={(e) => {
						availablePlates.update((availablePlates) => {
							const index = availablePlates.findIndex((p) => p.weight === plate.weight);

							if (e.currentTarget.value === '') {
								e.currentTarget.value = String(0);
							}

							if (e.currentTarget.value.startsWith('0')) {
								e.currentTarget.value = e.currentTarget.value.replace(/^0+/, '');
							}

							availablePlates[index] = {
								...plate,
								count: Number(e.currentTarget.value)
							};

							return availablePlates;
						});
					}}
				/>
				<span>{plate.weight}kg</span>
			</li>
		{/each}
	</ul>
{/if}

{#if $platesToLoad.length > 0}
	<p>{JSON.stringify($platesToLoad)}</p>
{/if}
