<script lang="ts">
	import ScoreCardComponent from '$lib/components/ScoreCardComponent.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import * as Table from '$lib/components/ui/table/index';
	import { getAllUsers } from '$lib/firebase/userRepo';
	import { onMount } from 'svelte';
	let userData: {
		name: string;
		registerNumber: number;
		challengesCompleted: string[];
		score: number;
		email: string;
	}[] = [];

	let loading = false;
	let searchTerm = '';
	$: currentUserData = userData.filter((user) => user.email.includes(searchTerm));
	onMount(async () => {
		loading = true;
		userData = await getAllUsers();
		loading = false;
	});
</script>

<div class="flex flex-col p-8">
	<div>
		<Label for="search" class="mb-1">Search</Label>
		<Input
			bind:value={searchTerm}
			type="email"
			placeholder="Enter Email to Search.."
			name="search"
			class="max-w-xs"
		/>
	</div>
	{#if loading}
		<Skeleton class="my-8 h-8 w-full" />
	{:else}
		<div class="my-8">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Name</Table.Head>
						<Table.Head>Email</Table.Head>
						<Table.Head>Register Number</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each currentUserData as user}
						<Table.Row>
							<Table.Cell>{user.name}</Table.Cell>
							<Table.Cell>{user.email}</Table.Cell>
							<Table.Cell>{user.registerNumber}</Table.Cell>
							<Table.Cell>
								<Dialog.Root>
									<Dialog.Trigger class={buttonVariants({ variant: 'default' })}
										>Show Score</Dialog.Trigger
									>
                                    <ScoreCardComponent id={user.email} challengesArray={user.challengesCompleted} />
								</Dialog.Root>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	{/if}
</div>
