<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Button } from '$lib/components/ui/button';
	import { signInUser } from '$lib/firebase/userRepo';
	import { toast } from 'svelte-sonner';
	import { Skeleton } from '$lib/components/ui/skeleton';
	let loading = false;
	async function handleFormSubmit(event: Event) {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		loading = true;
		const signInResult = await signInUser({
			email: formData.get('email') as string,
			password: formData.get('password') as string
		});
		loading = false;
		if (signInResult) {
			toast.success('Login successful');
		} else {
			toast.error('Login failed');
		}
	}
</script>

<div class="flex flex-col items-center justify-center p-8">
	<form class="flex flex-col space-y-8" on:submit={handleFormSubmit}>
		<div class="flex flex-col space-y-4">
			<Label for="email">Email</Label>
			<Input name="email" placeholder="Enter Email" class="w-96" required />
		</div>
		<div class="flex flex-col space-y-4">
			<Label for="password">Password</Label>
			<Input name="password" type="password" placeholder="Enter Password" class="w-96" required />
		</div>
		{#if loading}
			<Skeleton class="h-10" />
		{:else}
			<Button type="submit">Login</Button>
		{/if}
	</form>
</div>
