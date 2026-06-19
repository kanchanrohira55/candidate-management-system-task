const db = {
	users: [],
	candidates: [],
	userSequence: 1,
	candidateSequence: 1,
};

const clone = (record) => {
	if (!record) {
		return null;
	}

	return { ...record };
};

const applySelect = (record, select) => {
	if (!select) {
		return clone(record);
	}

	return Object.fromEntries(
		Object.entries(select)
			.filter(([, shouldInclude]) => shouldInclude)
			.map(([key]) => [key, record[key]]),
	);
};

const findByUniqueWhere = (records, where) =>
	records.find((record) =>
		Object.entries(where).every(([key, value]) => record[key] === value),
	);

const createUniqueError = (model, field) => {
	const error = new Error(`${model} ${field} must be unique`);
	error.code = "P2002";
	return error;
};

const testPrisma = {
	user: {
		findUnique: async ({ where }) => clone(findByUniqueWhere(db.users, where)),
		create: async ({ data }) => {
			if (db.users.some((user) => user.email === data.email)) {
				throw createUniqueError("User", "email");
			}

			const user = {
				id: `test_user_${db.userSequence++}`,
				email: data.email,
				password: data.password,
				createdAt: new Date(),
			};

			db.users.push(user);
			return clone(user);
		},
	},
	candidate: {
		findMany: async ({ orderBy, select } = {}) => {
			let candidates = [...db.candidates];

			if (orderBy?.createdAt === "desc") {
				candidates.sort((a, b) => b.createdAt - a.createdAt);
			}

			return candidates.map((candidate) => applySelect(candidate, select));
		},
		findUnique: async ({ where }) => clone(findByUniqueWhere(db.candidates, where)),
		create: async ({ data }) => {
			if (db.candidates.some((candidate) => candidate.email === data.email)) {
				throw createUniqueError("Candidate", "email");
			}

			const candidate = {
				id: `test_candidate_${db.candidateSequence++}`,
				name: data.name,
				email: data.email,
				status: data.status ?? "Applied",
				technicalScore: data.technicalScore ?? 0,
				communicationScore: data.communicationScore ?? 0,
				reliabilityScore: data.reliabilityScore ?? 0,
				notes: data.notes ?? "",
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			db.candidates.push(candidate);
			return clone(candidate);
		},
		update: async ({ where, data }) => {
			const candidate = findByUniqueWhere(db.candidates, where);

			if (!candidate) {
				throw new Error("Candidate not found");
			}

			if (
				data.email &&
				db.candidates.some(
					(existingCandidate) =>
						existingCandidate.id !== candidate.id &&
						existingCandidate.email === data.email,
				)
			) {
				throw createUniqueError("Candidate", "email");
			}

			Object.assign(candidate, data, { updatedAt: new Date() });
			return clone(candidate);
		},
		delete: async ({ where }) => {
			const index = db.candidates.findIndex((candidate) =>
				Object.entries(where).every(([key, value]) => candidate[key] === value),
			);

			if (index === -1) {
				throw new Error("Candidate not found");
			}

			const [candidate] = db.candidates.splice(index, 1);
			return clone(candidate);
		},
		count: async ({ where } = {}) => {
			if (!where) {
				return db.candidates.length;
			}

			return db.candidates.filter((candidate) =>
				Object.entries(where).every(([key, value]) => candidate[key] === value),
			).length;
		},
	},
};

export default testPrisma;
