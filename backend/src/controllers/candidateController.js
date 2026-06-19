import prisma from "../config/prisma.js";

const ALLOWED_STATUSES = [
	"Applied",
	"Shortlisted",
	"Interviewed",
	"Selected",
	"Rejected",
];

const SCORE_FIELDS = [
	"technicalScore",
	"communicationScore",
	"reliabilityScore",
];

const isUniqueConstraintError = (error) => error?.code === "P2002";

const isRecordNotFoundError = (error) =>
	error?.code === "P2025" || error?.message === "Candidate not found";

const validateEmail = (email) =>
	typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const parseScore = (field, value, defaultValue) => {
	if (value === undefined || value === null || value === "") {
		return { value: defaultValue };
	}

	const score = Number(value);

	if (!Number.isInteger(score) || score < 0 || score > 100) {
		return { error: `${field} must be an integer between 0 and 100` };
	}

	return { value: score };
};

const buildCandidateData = (body, { requireNameAndEmail = false } = {}) => {
	const data = {};

	if (requireNameAndEmail && (!body.name || !body.email)) {
		return { error: "Name and email required" };
	}

	if (body.name !== undefined) {
		if (typeof body.name !== "string" || body.name.trim() === "") {
			return { error: "Name is required" };
		}

		data.name = body.name.trim();
	}

	if (body.email !== undefined) {
		if (!validateEmail(body.email)) {
			return { error: "Valid email is required" };
		}

		data.email = body.email.trim().toLowerCase();
	}

	const status = body.status ?? (requireNameAndEmail ? "Applied" : undefined);

	if (status !== undefined) {
		if (!ALLOWED_STATUSES.includes(status)) {
			return {
				error: `Status must be one of: ${ALLOWED_STATUSES.join(", ")}`,
			};
		}

		data.status = status;
	}

	for (const field of SCORE_FIELDS) {
		const defaultValue = requireNameAndEmail ? 0 : undefined;
		const result = parseScore(field, body[field], defaultValue);

		if (result.error) {
			return { error: result.error };
		}

		if (result.value !== undefined) {
			data[field] = result.value;
		}
	}

	if (body.notes !== undefined) {
		if (typeof body.notes !== "string") {
			return { error: "Notes must be text" };
		}

		data.notes = body.notes;
	} else if (requireNameAndEmail) {
		data.notes = "";
	}

	return { data };
};

export const getCandidates = async (req, res) => {
	try {
		const candidates = await prisma.candidate.findMany({
			orderBy: { createdAt: "desc" },
		});
		res.json(candidates);
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({ error: "Failed to fetch candidates" });
	}
};

export const getCandidate = async (req, res) => {
	try {
		const { id } = req.params;
		const candidate = await prisma.candidate.findUnique({
			where: { id },
		});

		if (!candidate) {
			return res.status(404).json({ error: "Candidate not found" });
		}

		res.json(candidate);
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({ error: "Failed to fetch candidate" });
	}
};

export const createCandidate = async (req, res) => {
	try {
		const validation = buildCandidateData(req.body, {
			requireNameAndEmail: true,
		});

		if (validation.error) {
			return res.status(400).json({ error: validation.error });
		}

		const candidate = await prisma.candidate.create({
			data: validation.data,
		});

		res.status(201).json(candidate);
	} catch (error) {
		if (isUniqueConstraintError(error)) {
			return res.status(400).json({ error: "Candidate email already exists" });
		}

		console.error("Error:", error);
		res.status(500).json({ error: "Failed to create candidate" });
	}
};

export const updateCandidate = async (req, res) => {
	try {
		const { id } = req.params;
		const validation = buildCandidateData(req.body);

		if (validation.error) {
			return res.status(400).json({ error: validation.error });
		}

		const candidate = await prisma.candidate.update({
			where: { id },
			data: validation.data,
		});

		res.json(candidate);
	} catch (error) {
		if (isUniqueConstraintError(error)) {
			return res.status(400).json({ error: "Candidate email already exists" });
		}

		if (isRecordNotFoundError(error)) {
			return res.status(404).json({ error: "Candidate not found" });
		}

		console.error("Error:", error);
		res.status(500).json({ error: "Failed to update candidate" });
	}
};

export const deleteCandidate = async (req, res) => {
	try {
		const { id } = req.params;

		await prisma.candidate.delete({
			where: { id },
		});

		res.json({ message: "Candidate deleted successfully" });
	} catch (error) {
		if (isRecordNotFoundError(error)) {
			return res.status(404).json({ error: "Candidate not found" });
		}

		console.error("Error:", error);
		res.status(500).json({ error: "Failed to delete candidate" });
	}
};

export const getDashboard = async (req, res) => {
	try {
		const totalCandidates = await prisma.candidate.count();

		const selectedCandidates = await prisma.candidate.count({
			where: { status: "Selected" },
		});

		const rejectedCandidates = await prisma.candidate.count({
			where: { status: "Rejected" },
		});

		const candidates = await prisma.candidate.findMany({
			select: {
				technicalScore: true,
				communicationScore: true,
				reliabilityScore: true,
			},
		});

		const avgTechnical =
			candidates.reduce((acc, c) => acc + (c.technicalScore || 0), 0) /
			(candidates.length || 1);
		const avgCommunication =
			candidates.reduce((acc, c) => acc + (c.communicationScore || 0), 0) /
			(candidates.length || 1);
		const avgReliability =
			candidates.reduce((acc, c) => acc + (c.reliabilityScore || 0), 0) /
			(candidates.length || 1);

		res.json({
			totalCandidates,
			selectedCandidates,
			rejectedCandidates,
			avgScores: {
				technical: Math.round(avgTechnical),
				communication: Math.round(avgCommunication),
				reliability: Math.round(avgReliability),
			},
		});
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({ error: "Failed to fetch dashboard data" });
	}
};
