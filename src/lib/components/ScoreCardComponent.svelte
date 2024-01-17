<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index';
	import { getChallengesData } from '$lib/firebase/challengeRepo';
	import type { ChallengeWithIdSchema } from '$lib/firebase/schemas';
	import { onMount } from 'svelte';
	import * as Table from '$lib/components/ui/table/index';
	import Skeleton from './ui/skeleton/skeleton.svelte';
	export let challengesArray: string[];
	export let id: string;
	let loading = false;
	let challengesData: ChallengeWithIdSchema[] = [];
	async function loadData() {
		if (challengesArray.length === 0) return;
		loading = true;
		challengesData = await getChallengesData(challengesArray);
		loading = false;
	}
	onMount(() => {
		loadData();
	});
	const scoreMap = new Map([
		['easy', 5],
		['medium', 10],
		['hard', 15]
	]);
</script>

<Dialog.Content id={`${id}-dialog`}>
	<Dialog.Header>
		<Dialog.Title>Score Details</Dialog.Title>
	</Dialog.Header>
	{#if loading}
		<Skeleton class="my-8 h-8 w-full" />
	{:else}
		<Table.Root>
			<Table.Caption>A list of your recent invoices.</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-[100px]">Challenge Name</Table.Head>
					<Table.Head>Difficulty</Table.Head>
					<Table.Head class="text-right">Score</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each challengesData as challenge}
					<Table.Row>
						<Table.Cell>{challenge.name}</Table.Cell>
						<Table.Cell>{challenge.type}</Table.Cell>
						<Table.Cell class="text-right">{scoreMap.get(challenge.type)}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{/if}
</Dialog.Content>
