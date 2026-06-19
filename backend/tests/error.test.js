import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../src/index.js";

describe("Error Handling Tests", () => {
	let token;

	beforeAll(async () => {
		// Register and login
		const userEmail = `error${Date.now()}@test.com`;
		await request(app)
			.post("/api/auth/register")
			.send({ email: userEmail, password: "123456" });

		const loginRes = await request(app)
			.post("/api/auth/login")
			.send({ email: userEmail, password: "123456" });

		token = loginRes.body.token;
	});

	it("GET /api/candidates/999 - should return 404", async () => {
		const response = await request(app)
			.get("/api/candidates/999")
			.set("Authorization", `Bearer ${token}`);

		expect(response.status).toBe(404);
		expect(response.body).toHaveProperty("error");
	});

	it("POST /api/candidates without auth - should return 401", async () => {
		const response = await request(app).post("/api/candidates").send({
			name: "Test",
			email: "test@test.com",
			status: "Applied",
		});

		expect(response.status).toBe(401);
	});

	it("Invalid route - should return 404", async () => {
		const response = await request(app).get("/api/invalid-route");

		expect(response.status).toBe(404);
	});
});
