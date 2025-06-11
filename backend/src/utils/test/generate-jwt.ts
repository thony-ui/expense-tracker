import jwt from "jsonwebtoken";

require("dotenv").config();

export function generateTestJWT(uid: string): string {
  const secret = process.env.SECRET_KEY!;
  const payload = {
    sub: uid,
  };
  return jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn: "1h",
  });
}
