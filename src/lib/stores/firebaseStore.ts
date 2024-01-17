import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { type ChallengeSchema, type UserSchema } from '$lib/firebase/schemas';
import { writable } from 'svelte/store';

export const userStore = writable<UserSchema | undefined>(undefined);
export const authStateStore = writable<boolean>(false);
export const challengeStore = writable<ChallengeSchema[]>([]);

authStateStore.subscribe((value) => {
	if (browser) {
		if (value) {
			goto('/');
		} else {
			goto('/login');
		}
	}
});
