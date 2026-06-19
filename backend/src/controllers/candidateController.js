import prisma from "../config/prisma.js";

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
		const {
			name,
			email,
			status,
			technicalScore,
			communicationScore,
			reliabilityScore,
			notes,
		} = req.body;

		if (!name || !email) {
			return res.status(400).json({ error: "Name and email required" });
		}

		const candidate = await prisma.candidate.create({
			data: {
				name,
				email,
				status: status || "Applied",
				technicalScore: parseInt(technicalScore) || 0,
				communicationScore: parseInt(communicationScore) || 0,
				reliabilityScore: parseInt(reliabilityScore) || 0,
				notes: notes || "",
			},
		});

		res.status(201).json(candidate);
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({ error: "Failed to create candidate" });
	}
};

export const updateCandidate = async (req, res) => {
	try {
		const { id } = req.params;
		const {
			name,
			email,
			status,
			technicalScore,
			communicationScore,
			reliabilityScore,
			notes,
		} = req.body;

		const candidate = await prisma.candidate.update({
			where: { id },
			data: {
				name,
				email,
				status,
				technicalScore: parseInt(technicalScore) || 0,
				communicationScore: parseInt(communicationScore) || 0,
				reliabilityScore: parseInt(reliabilityScore) || 0,
				notes: notes || "",
			},
		});

		res.json(candidate);
	} catch (error) {
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
