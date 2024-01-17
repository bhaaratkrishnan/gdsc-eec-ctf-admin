<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import * as Select from '$lib/components/ui/select';
	import { onMount } from 'svelte';
	import { ChallengeType } from '$lib/firebase/schemas';
	import { getDomains } from '$lib/firebase/domainRepo';
	import { toast } from 'svelte-sonner';
	import { checkIfChallengeNameExists, createNewChallenge } from '$lib/firebase/challengeRepo';
	let domains: string[];
	let loading = false;
	onMount(async () => {
		loading = true;
		domains = await getDomains();
		loading = false;
	});
	async function handleFormSubmit(event: Event) {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		const type = formData.get('type') as ChallengeType;
		const name = formData.get('name') as string;
		const solution = formData.get('solution') as string;
		const domain = formData.get('domain') as string;
		if (type.length === 0 || name === null || solution.length === 0 || domain.length === 0) {
			alert('Please fill all the fields');
			return;
		}
		loading = true;
		if (await checkIfChallengeNameExists(name)) {
			alert('Challenge name already exists');
			loading = false;
			return;
		}

		const createChallengeResult = await createNewChallenge({
			challenge: {
				name,
				solution,
				type
			},
			domain: domain
		});
		if (createChallengeResult) {
			toast.success('Challenge created successfully');
		} else {
			toast.error('Error creating challenge');
		}
		loading = false;
	}
</script>

<div class="flex flex-col items-center justify-center space-y-8 p-8">
	<div class="text-3xl font-bold">New Challenge</div>
	<form class="flex flex-col space-y-8" on:submit={handleFormSubmit}>
		<div class="flex flex-col space-y-4">
			<Label for="name">Challenge Name</Label>
			<Input name="name" placeholder="Enter Challenge Name" class="w-96" required />
		</div>
		<div class="flex flex-col space-y-4">
			<Label for="solution">Solution</Label>
			<Input name="solution" type="Solution" placeholder="Enter Solution" class="w-96" required />
		</div>
		<!-- Type  -->
		<Select.Root>
			<Select.Trigger class="w-96">
				<Select.Value placeholder="Select Difficulty" />
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					<Select.Item value="easy">Easy</Select.Item>
					<Select.Item value="medium">Medium</Select.Item>
					<Select.Item value="hard">Hard</Select.Item>
				</Select.Group>
			</Select.Content>
			<Select.Input name="type" required />
		</Select.Root>
		<!-- domain  -->
		<Select.Root required>
			<Select.Trigger class="w-96">
				<Select.Value placeholder="Select Domain" />
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{#each domains as domain}
						<Select.Item value={domain}>{domain.toUpperCase()}</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
			<Select.Input name="domain" required />
		</Select.Root>
		{#if loading}
			<Skeleton class="h-10" />
		{:else}
			<!-- svelte-ignore missing-declaration -->
			<Button type="submit">Create</Button>
		{/if}
	</form>
</div>
