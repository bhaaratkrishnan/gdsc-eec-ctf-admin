<script>
	import '../app.pcss';
	import { signOutUser } from '$lib/firebase/userRepo';
	import { Button } from '$lib/components/ui/button/';
	import { Sun, Moon } from 'lucide-svelte';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';
	import { toggleMode } from 'mode-watcher';
	import {authStateStore} from "$lib/stores/firebaseStore"
</script>

<Toaster />
<ModeWatcher />
<div>
	<div class="flex w-full flex-row justify-between space-x-8 px-8 py-4">
		<div>
			<a href="/">
				<Button>GDSC EEC CTF Admin</Button>
			</a>
		</div>
		<div class="flex flex-row items-center justify-center space-x-8">
			<Button on:click={toggleMode} variant="outline" size="icon">
				<Sun
					class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
				/>
				<Moon
					class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
			{#if $authStateStore}
				
			<Button on:click={signOutUser}>Log out</Button>
			{/if}
		</div>
	</div>
	<slot />
</div>
