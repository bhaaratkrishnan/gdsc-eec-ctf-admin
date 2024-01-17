<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { onMount } from 'svelte';
	import { ChallengeType } from '$lib/firebase/schemas';
	import { getDomains, createDomain } from '$lib/firebase/domainRepo';
	import { toast } from 'svelte-sonner';
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
		const domain = formData.get('domain') as string;
		if (domains.filter((e) => e === domain).length > 0) {
			alert('Domain name already exists');
			return;
		}
		loading =  true;
        try {
			await createDomain(domain);
            toast.success('Domain created successfully');
		} catch (e) {
			console.log(e);
			toast.error('Error creating domain');
		}
		loading = false;
	}
</script>

<div class="flex flex-col items-center justify-center space-y-8 p-8">
	<div class="text-3xl font-bold">New Domain</div>
	<form class="flex flex-col space-y-8" on:submit={handleFormSubmit}>
		<div class="flex flex-col space-y-4">
			<Label for="domain">Domain Name</Label>
			<Input name="domain" placeholder="Enter Domain Name" class="w-96" required />
		</div>

		{#if loading}
			<Skeleton class="h-10" />
		{:else}
			<!-- svelte-ignore missing-declaration -->
			<Button type="submit">Create</Button>
		{/if}
	</form>
</div>
