import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../src/index.js";

describe("Candidate Status Update Tests", () => {
	let token;
	let candidateId;

	beforeAll(async () => {
		// Register user
		const userEmail = `status${Date.now()}@test.com`;
		await request(app)
			.post("/api/auth/register")
			.send({ email: userEmail, password: "123456" });

		// Login
		const loginRes = await request(app)
			.post("/api/auth/login")
			.send({ email: userEmail, password: "123456" });

		token = loginRes.body.token;

		// Create candidate
		const createRes = await request(app)
			.post("/api/candidates")
			.set("Authorization", `Bearer ${token}`)
			.send({
				name: "Status Test",
				email: `status${Date.now()}@test.com`,
				status: "Applied",
			});

		candidateId = createRes.body.id;
	});

	it("Should update candidate status from Applied to Shortlisted", async () => {
		const response = await request(app)
			.put(`/api/candidates/${candidateId}`)
			.set("Authorization", `Bearer ${token}`)
			.send({
				name: "Status Test",
				email: `status${Date.now()}@test.com`,
				status: "Shortlisted",
			});

		expect(response.status).toBe(200);
		expect(response.body.status).toBe("Shortlisted");
	});

	it("Should update candidate status to Selected", async () => {
		const response = await request(app)
			.put(`/api/candidates/${candidateId}`)
			.set("Authorization", `Bearer ${token}`)
			.send({
				name: "Status Test",
				email: `status${Date.now()}@test.com`,
				status: "Selected",
			});

		expect(response.status).toBe(200);
		expect(response.body.status).toBe("Selected");
	});

	it("Should update candidate with scores", async () => {
		const response = await request(app)
			.put(`/api/candidates/${candidateId}`)
			.set("Authorization", `Bearer ${token}`)
			.send({
				name: "Status Test",
				email: `status${Date.now()}@test.com`,
				status: "Selected",
				technicalScore: 85,
				communicationScore: 90,
				reliabilityScore: 75,
			});

		expect(response.status).toBe(200);
		expect(response.body.technicalScore).toBe(85);
		expect(response.body.communicationScore).toBe(90);
		expect(response.body.reliabilityScore).toBe(75);
	});
});
