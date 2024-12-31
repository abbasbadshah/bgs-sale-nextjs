import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = "your_super_secret_key_123!@#$%^&*()_+";

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export async function getToken(req) {
  const cookieStore = cookies();
  return cookieStore.get("token")?.value;
}
