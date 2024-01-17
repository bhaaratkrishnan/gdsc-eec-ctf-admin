<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { onMount } from 'svelte';
	import { deleteDomain, getDomains } from '$lib/firebase/domainRepo';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { get } from 'svelte/store';
	import { authStateStore } from '$lib/stores/firebaseStore';
	import { goto } from '$app/navigation';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { toast } from 'svelte-sonner';
	onMount(() => {});
	let domains: string[] = [];
	let loading = false;
	onMount(async () => {
		if (get(authStateStore) === false) {
			goto('/login');
		}
		loading = true;
		domains = await getDomains();
		loading = false;
	});
	async function handleDeleteDomain(id: string) {
		loading = true;
		if (await deleteDomain(id)) {
			domains = domains.filter((domain) => domain !== id);
			toast.success('Domain deleted');
		} else {
			toast.error('Failed to delete domain');
		}
		loading = false;
	}
</script>

<div class="flex w-full flex-col items-center justify-center p-8">
	<div class="font-mono text-3xl font-bold">CTF Admin</div>
	<div class="my-8 flex w-full flex-col items-start justify-start space-y-8">
		<a href="/create/domain">
			<Button variant="secondary">+ Add new Domain</Button>
		</a>
		<a href="/create/challenge">
			<Button variant="secondary">+ Add new Challenge</Button>
		</a>
		<a href="/users">
			<Button variant="default">Students Progress</Button>
		</a>
		
	</div>
	<div class="flex w-full flex-row items-start justify-start space-x-8 text-2xl">
		{#if loading}
			<Skeleton class="h-60 w-96" />
		{:else}
			{#each domains as domain}
				<Card.Root>
					<a href={`/domain/${domain}`}>
						<Card.Header>
							<Card.Title class="uppercase">{domain}</Card.Title>
						</Card.Header>
					</a>
					<Card.Footer>
						<AlertDialog.Root>
							<AlertDialog.Trigger asChild let:builder>
								<Button builders={[builder]} variant="destructive">Delete</Button>
							</AlertDialog.Trigger>
							<AlertDialog.Content>
								<AlertDialog.Header>
									<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
									<AlertDialog.Description>
										This action cannot be undone. This will permanently delete your challege from
										all users and leaderboards
									</AlertDialog.Description>
								</AlertDialog.Header>
								<AlertDialog.Footer>
									<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
									<AlertDialog.Action
										on:click={() => {
											handleDeleteDomain(domain);
										}}>Continue</AlertDialog.Action
									>
								</AlertDialog.Footer>
							</AlertDialog.Content>
						</AlertDialog.Root>
					</Card.Footer>
				</Card.Root>
			{/each}
		{/if}
	</div>
</div>
