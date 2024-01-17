import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	documentId,
	getDoc,
	getDocs,
	getFirestore,
	query,
	updateDoc,
	where
} from 'firebase/firestore';
import { app, challengeCollections } from './config';
import {
	ChallengeType,
	type ChallengeSchema,
	type ChallengeWithIdSchema,
	type DomainChallengeSchema
} from './schemas';
import { getAllUsers } from './userRepo';
import { getDomains } from './domainRepo';

export const getChallengesData = async (challenges: string[]) => {
	const db = getFirestore(app);
	console.log(challenges);

	const challengesQuery = query(
		collection(db, challengeCollections),
		where(documentId(), 'in', challenges)
	);
	console.log('Quering');

	const querySnapShot = await getDocs(challengesQuery);

	const res: ChallengeWithIdSchema[] = [];
	querySnapShot.forEach((doc) => {
		res.push({ ...doc.data(), id: doc.id } as ChallengeWithIdSchema);
	});
	return res;
};

export const updateChallengeFlag = async (challengeId: string, newFlag: string) => {
	const db = getFirestore(app);
	const challengeRef = doc(db, challengeCollections, challengeId);
	await updateDoc(challengeRef, { solution: newFlag });
};

export const createNewChallenge = async ({
	challenge,
	domain
}: {
	challenge: ChallengeSchema;
	domain: string;
}) => {
	// create new challenge
	const db = getFirestore(app);
	// const challengeRef = doc;
	// await setDoc(challengeRef, challenge);
	const challengeRef = await addDoc(collection(db, challengeCollections), challenge);
	// add challenge to domain
	const domainRef = doc(db, 'domains', domain);
	const domainSnapShot = await getDoc(domainRef);
	if (domainSnapShot.exists()) {
		const domainData = domainSnapShot.get('data') as DomainChallengeSchema[];
		if (domainData) {
			const newChallenge: DomainChallengeSchema = {
				id: challengeRef.id,
				name: challenge.name,
				type: challenge.type
			};
			domainData.push(newChallenge);
			await updateDoc(domainRef, {
				data: domainData
			});
			return true;
		}
		return false;
	}
	return false;
};

export const checkIfChallengeNameExists = async (challengeName: string) => {
	const db = getFirestore(app);
	const challengesQuery = query(
		collection(db, challengeCollections),
		where('name', '==', challengeName)
	);
	const querySnapShot = await getDocs(challengesQuery);
	return !querySnapShot.empty;
};

export const deleteChallenge = async (challengeId: string) => {
	const db = getFirestore(app);
	const challengeRef = doc(db, challengeCollections, challengeId);
	await deleteDoc(challengeRef);
	const allUserData = await getAllUsers();
	allUserData.forEach(async (user) => {
		for (let challenge of user.challengesCompleted) {
			if (challenge === challengeId) {
				const userRef = doc(db, 'users', user.email);
				await updateDoc(userRef, {
					challengesCompleted: user.challengesCompleted.filter((id) => id !== challengeId)
				});
			}
		}
	});
	const allDomainData = await getDomains();
	allDomainData.forEach(async (domain) => {
		const domainRef = doc(db, 'domains', domain);
		const domainSnapShot = await getDoc(domainRef);
		if (domainSnapShot.exists()) {
			const domainData = domainSnapShot.get('data') as DomainChallengeSchema[];
			if (domainData) {
				await updateDoc(domainRef, {
					data: domainData.filter((challenge) => challenge.id !== challengeId)
				});
			}
		}
	});
};
export const calculateScore = async (challenges: string[]) => {
	const challengesData = await getChallengesData(challenges);
	let score = 0;
	challengesData.forEach((challenge) => {
		if (challenge.type === ChallengeType.EASY) {
			score += 5;
		} else if (challenge.type === ChallengeType.MEDIUM) {
			score += 10;
		} else {
			score += 15;
		}
	});
	return score;
};
