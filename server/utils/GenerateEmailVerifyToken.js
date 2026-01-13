import jwt from "jsonwebtoken";

export const generateEmailVerifyToken = (userId) => {
  if (!userId) {
    throw new Error("User ID is required to generate token");
  }

  return jwt.sign(
    { userId },
    process.env.JWT_VERIFY_SECRET,
    { expiresIn: "5m" } // ⏱️ 5 minutes
  );
};
