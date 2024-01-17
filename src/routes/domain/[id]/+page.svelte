<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { ChallengeWithIdSchema } from '$lib/firebase/schemas';
	import { onMount } from 'svelte';
	import { getDomainData } from '$lib/firebase/domainRepo';
	import {
		deleteChallenge,
		getChallengesData,
		updateChallengeFlag
	} from '$lib/firebase/challengeRepo';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	export let data: PageData;
	let challenges: ChallengeWithIdSchema[] = [];
	let loading = false;
	onMount(async () => {
		await fetchChallengeData();
	});
	async function fetchChallengeData() {
		loading = true;
		const domainData = await getDomainData(data.id ?? '');
		if (domainData) {
			const challengeIds = domainData.map((e) => e.id);
			if (challengeIds.length > 0) {
				challenges = (await getChallengesData(challengeIds)) ?? [];
			}
		}
		loading = false;
	}
	async function handleFlagUpdate(challengeName: string) {
		const newFlag = challenges.find((e) => e.name === challengeName)?.solution;
		if (newFlag) {
			const challengeId = challenges.find((e) => e.name === challengeName)?.id;
			if (challengeId) {
				loading = true;
				await updateChallengeFlag(challengeId, newFlag);
				loading = false;
			}
		}
	}
	async function deleteChallengeHanlder(challengeName: string) {
		const challenge = challenges.find((e) => e.name === challengeName);
		if (challenge) {
			challenges = challenges.filter((e) => e.name !== challengeName);
			loading = true;
			await deleteChallenge(challenge.id);
			loading = false;
		}
	}
</script>

<div class="flex flex-row space-x-8 p-8">
	{#if loading}
		<Skeleton class="h-60 w-60" />
	{:else}
		{#each challenges as challenge}
			<Card.Root class="w-60">
				<Card.Header>
					<Card.Title>{challenge.name}</Card.Title>
					<Card.Description>{challenge.type}</Card.Description>
				</Card.Header>
				<Card.Content>
					<Label for="solution">Solution :</Label>
					<Input name="solution" bind:value={challenge.solution}></Input>
				</Card.Content>
				<Card.Footer class="space-x-4">
					<Button on:click={() => handleFlagUpdate(challenge.name)}>Update</Button>
					<!-- <Button variant="destructive" on:click={() => deleteChallengeHanlder(challenge.name)}
						>Delete</Button
					> -->
					<!-- <Button variant="destructive" on:click={() => deleteChallengeHanlder(challenge.name)}
						>Delete</Button
					> -->
					<script lang="ts">
						import * as AlertDialog from '$lib/components/ui/alert-dialog';
						import { Button } from '$lib/components/ui/button';
					</script>

					<AlertDialog.Root>
						<AlertDialog.Trigger asChild let:builder>
							<Button builders={[builder]} variant="destructive">Delete</Button>
						</AlertDialog.Trigger>
						<AlertDialog.Content>
							<AlertDialog.Header>
								<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
								<AlertDialog.Description>
									This action cannot be undone. This will permanently delete your challege from all users and leaderboards
								</AlertDialog.Description>
							</AlertDialog.Header>
							<AlertDialog.Footer>
								<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
								<AlertDialog.Action on:click={() => deleteChallengeHanlder(challenge.name)}
									>Continue</AlertDialog.Action
								>
							</AlertDialog.Footer>
						</AlertDialog.Content>
					</AlertDialog.Root>
				</Card.Footer>
			</Card.Root>
		{/each}
	{/if}
</div>
