import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { getDomainData } from '$lib/firebase/domainRepo';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    return {
        id:params.id,
    }
};
