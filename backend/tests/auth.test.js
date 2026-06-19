import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../src/index.js";

describe("Authentication Tests", () => {
	let registeredEmail = `test${Date.now()}@test.com`;
	let token;

	it("POST /api/auth/register - should register user successfully", async () => {
		const response = await request(app).post("/api/auth/register").send({
			email: registeredEmail,
			password: "123456",
		});

		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty("success", true);
		expect(response.body).toHaveProperty("token");
		token = response.body.token;
	});

	it("POST /api/auth/login - should login successfully", async () => {
		const response = await request(app).post("/api/auth/login").send({
			email: registeredEmail,
			password: "123456",
		});

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("success", true);
		expect(response.body).toHaveProperty("token");
	});

	it("POST /api/auth/login - should return 401 with wrong password", async () => {
		const response = await request(app).post("/api/auth/login").send({
			email: registeredEmail,
			password: "wrongpassword",
		});

		expect(response.status).toBe(401);
		expect(response.body).toHaveProperty("error");
	});
});
