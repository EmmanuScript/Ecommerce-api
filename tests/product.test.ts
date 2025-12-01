import request from "supertest";
import app from "../src/server";
import { connectDatabase, disconnectDatabase } from "../src/config/database";
import Product from "../src/models/Product";

describe("Product API", () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await Product.deleteMany({});
    await disconnectDatabase();
  });

  describe("GET /api/products", () => {
    it("should return all active products", async () => {
      const response = await request(app).get("/api/products");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("products");
      expect(response.body).toHaveProperty("pagination");
      expect(Array.isArray(response.body.products)).toBe(true);
    });

    // TODO: Add test for category filtering
    // TODO: Add test for search functionality
    // TODO: Add test for pagination
  });

  describe("POST /api/products", () => {
    // TODO: Implement test for creating products (requires admin auth)
    // TODO: Add test for validation errors
  });

  // TODO: Add tests for product update and deletion
});
