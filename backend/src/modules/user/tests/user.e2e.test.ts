import request from "supertest";
import { generateTestJWT } from "../../../utils/test/generate-jwt";
import { app, server } from "../../..";

describe("User routes", () => {
  afterAll((done) => {
    // Close server after tests
    server.close(done);
  });

  it("should fetch a user if authenticated", async () => {
    const token = generateTestJWT("ff7e3cd8-0491-479d-b1c8-f5cccfe024c9");

    const res = await request(app)
      .get("/v1/users/")
      .set("Authorization", `Bearer ${token}`);

    expect(res.body).toEqual(
      expect.objectContaining({
        id: "ff7e3cd8-0491-479d-b1c8-f5cccfe024c9",
        name: "sdfasfasdfsfsfdsfsa",
        email: "a@gmail.com",
      })
    );
    expect(res.statusCode).toBe(200);
  });
});
