import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app, userCollections } from './config';
import { Firestore, collection, doc, getDoc, getDocs, getFirestore } from 'firebase/firestore';
import { RoleType, type UserSchema } from './schemas';
import { authStateStore, userStore } from '$lib/stores/firebaseStore';

export const signInUser = async ({ email, password }: { email: string; password: string }) => {
	const auth = getAuth(app);
	const userCredential = await signInWithEmailAndPassword(auth, email, password);
	if (auth.currentUser) {
		const userData = await getUserData(email);
		if (userData !== undefined) {
			userStore.set(userData);
			authStateStore.set(true);
			return true;
		}
		return false;
	}
	return false;
};

export const getUserData = async (email: string) => {
	const db = getFirestore(app);
	const docRef = doc(db, 'users', email);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		const userData = docSnap.data() as UserSchema;
		if (userData.role === RoleType.ADMIN) {
			return userData;
		}
		const auth = getAuth(app);
		auth.signOut();
		return undefined;
	}
	return undefined;
};

export const getAllUsers = async () => {
	const db = getFirestore(app);
	const usersRef = await getDocs(collection(db, userCollections));
	let userData: {
		name: string;
		registerNumber: number;
		challengesCompleted: string[];
		score: number;
		email:string;
	}[] = [];
	usersRef.forEach((doc) => {
		const data = doc.data() as UserSchema;
		userData.push({
			name: data.name,
			registerNumber: data.registerNumber ?? 0,
			challengesCompleted: data.challengeCompleted ?? [],
			email: data.email,
			score: 0
		});
	});
	return userData;
};


getAuth(app).onAuthStateChanged(async (user) => {
	if(user) {
		authStateStore.set(true);
	}
	else {
		authStateStore.set(false);	
	}
})

export const signOutUser = async () => {
	const auth = getAuth(app);
	await auth.signOut();
	authStateStore.set(false);
	userStore.set(undefined);
}
