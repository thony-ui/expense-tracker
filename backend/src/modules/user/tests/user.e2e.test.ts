import request from "supertest";
import { generateTestJWT } from "../../../utils/test/generate-jwt";
import { app, server } from "../../../index";

require("dotenv").config(); // Load environment variables from .env file
process.env.PORT = "9999";

describe("User routes", () => {
  afterAll((done) => {
    // Close server after tests
    server.close(done);
  });

  it("should fetch a user if authenticated", async () => {
    const token = generateTestJWT("bea08fc5-ab2d-4f15-a103-ce6cda6f39db");

    const res = await request(app)
      .get("/v1/users/")
      .set("Authorization", `Bearer ${token}`);

    expect(res.body).toEqual(
      expect.objectContaining({
        id: "bea08fc5-ab2d-4f15-a103-ce6cda6f39db",
        name: "test",
        email: "test@gmail.com",
      })
    );
    expect(res.statusCode).toBe(200);
  });
});
