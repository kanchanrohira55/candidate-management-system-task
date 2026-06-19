import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/index.js";

describe("Business Rules Tests", () => {
	const testEmail = `duplicate${Date.now()}@test.com`;

	it("Should not allow duplicate email registration", async () => {
		// First registration
		await request(app)
			.post("/api/auth/register")
			.send({ email: testEmail, password: "123456" });

		// Second registration with same email
		const response = await request(app)
			.post("/api/auth/register")
			.send({ email: testEmail, password: "123456" });

		expect(response.status).toBe(400);
		expect(response.body.error).toBe("User already exists");
	});

	it("Should not allow duplicate candidate email", async () => {
		// First register user
		const userEmail = `user${Date.now()}@test.com`;
		await request(app)
			.post("/api/auth/register")
			.send({ email: userEmail, password: "123456" });

		// Login to get token
		const loginRes = await request(app)
			.post("/api/auth/login")
			.send({ email: userEmail, password: "123456" });

		const token = loginRes.body.token;

		// Create first candidate
		await request(app)
			.post("/api/candidates")
			.set("Authorization", `Bearer ${token}`)
			.send({
				name: "John Doe",
				email: "john@test.com",
				status: "Applied",
			});

		// Try to create second candidate with same email
		const response = await request(app)
			.post("/api/candidates")
			.set("Authorization", `Bearer ${token}`)
			.send({
				name: "Jane Doe",
				email: "john@test.com",
				status: "Applied",
			});

		expect(response.status).toBe(400);
		expect(response.body.error).toBe("Candidate email already exists");
	});

	it("Should reject invalid candidate status", async () => {
		const userEmail = `invalid-status${Date.now()}@test.com`;
		await request(app)
			.post("/api/auth/register")
			.send({ email: userEmail, password: "123456" });

		const loginRes = await request(app)
			.post("/api/auth/login")
			.send({ email: userEmail, password: "123456" });

		const response = await request(app)
			.post("/api/candidates")
			.set("Authorization", `Bearer ${loginRes.body.token}`)
			.send({
				name: "Invalid Status",
				email: `invalid-status${Date.now()}@test.com`,
				status: "Hired",
			});

		expect(response.status).toBe(400);
		expect(response.body.error).toContain("Status must be one of");
	});

	it("Should reject scores outside the allowed range", async () => {
		const userEmail = `invalid-score${Date.now()}@test.com`;
		await request(app)
			.post("/api/auth/register")
			.send({ email: userEmail, password: "123456" });

		const loginRes = await request(app)
			.post("/api/auth/login")
			.send({ email: userEmail, password: "123456" });

		const response = await request(app)
			.post("/api/candidates")
			.set("Authorization", `Bearer ${loginRes.body.token}`)
			.send({
				name: "Invalid Score",
				email: `invalid-score${Date.now()}@test.com`,
				status: "Applied",
				technicalScore: 101,
			});

		expect(response.status).toBe(400);
		expect(response.body.error).toBe(
			"technicalScore must be an integer between 0 and 100",
		);
	});
});
