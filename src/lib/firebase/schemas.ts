export type UserSchema = {
	email: string;
	name: string;
	role: RoleType;
	registerNumber?: number;
	challengeCompleted?: string[];
};

export enum RoleType {
	'ADMIN' = 'admin',
	'STUDENT' = 'student'
}
export type DomainChallengeSchema = {
	id: string;
	name: string;
	type: ChallengeType;
};

export enum ChallengeType {
	'EASY' = 'easy',
	'MEDIUM' = 'medium',
	'HARD' = 'hard'
}

export type ChallengeSchema = {
	name: string;
	solution: string;
	type: ChallengeType;
};

export type ChallengeWithIdSchema = ChallengeSchema & {
	id: string;
};
