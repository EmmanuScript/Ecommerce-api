import request from "supertest";
import app from "../src/server";
import { connectDatabase, disconnectDatabase } from "../src/config/database";
import User from "../src/models/User";

describe("User Authentication", () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await disconnectDatabase();
  });

  describe("POST /api/users/register", () => {
    it("should register a new user successfully", async () => {
      const response = await request(app).post("/api/users/register").send({
        email: "test@example.com",
        password: "password123",
        firstName: "Test",
        lastName: "User",
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        "message",
        "User registered successfully"
      );
      expect(response.body).toHaveProperty("userId");
    });

    it("should not register user with duplicate email", async () => {
      // First registration
      await request(app).post("/api/users/register").send({
        email: "duplicate@example.com",
        password: "password123",
        firstName: "First",
        lastName: "User",
      });

      // Attempt duplicate
      const response = await request(app).post("/api/users/register").send({
        email: "duplicate@example.com",
        password: "password456",
        firstName: "Second",
        lastName: "User",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "User already exists");
    });

    // TODO: Add test for password validation (strength requirements)
    // TODO: Add test for email format validation
  });

  describe("POST /api/users/login", () => {
    beforeEach(async () => {
      await request(app).post("/api/users/register").send({
        email: "login@example.com",
        password: "password123",
        firstName: "Login",
        lastName: "Test",
      });
    });

    it("should login successfully with correct credentials", async () => {
      const response = await request(app).post("/api/users/login").send({
        email: "login@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toHaveProperty("email", "login@example.com");
    });

    it("should not login with incorrect password", async () => {
      const response = await request(app).post("/api/users/login").send({
        email: "login@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error", "Invalid credentials");
    });
  });

  // TODO: Add tests for profile endpoints
  // TODO: Add tests for authorization (admin routes)
});
