import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	setDoc
} from 'firebase/firestore';
import { app, domainCollections } from './config';
import type { DomainChallengeSchema } from './schemas';
import { deleteChallenge } from './challengeRepo';

export const getDomainData = async (id: string) => {
	const db = getFirestore(app);
	const domainRef = doc(db, 'domains', id);
	const domainSnap = await getDoc(domainRef);
	if (domainSnap.exists()) {
		return domainSnap.get('data') as DomainChallengeSchema[];
	} else {
		return undefined;
	}
};

export const createDomain = async (id: string) => {
	const db = getFirestore(app);
	const domainRef = doc(db, 'domains', id);
	await setDoc(domainRef, { data: [] });
	return true;
};

export const getDomains = async () => {
	const db = getFirestore(app);
	const domainSnapShot = await getDocs(collection(db, domainCollections));
	const res: string[] = [];
	domainSnapShot.forEach((doc) => {
		res.push(doc.id);
	});
	return res;
};

export const deleteDomain = async (id: string) => {
	const db = getFirestore(app);
	const domainData = await getDomainData(id);
	if (domainData) {
		domainData.forEach(async (challenge) => {
			await deleteChallenge(challenge.id);
		});
		const domainRef = doc(db, 'domains', id);
		await deleteDoc(domainRef);
		return true;
	} else {
		return false;
	}
};
