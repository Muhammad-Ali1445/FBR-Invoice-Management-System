import jwt from "jsonwebtoken";

/**
 * Generate JWT token for a user
 * @param {Object} user - Mongoose user object
 * @returns {string} JWT token
 */
export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role, // this is ObjectId or populated object
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // 7 days validity
  );
};
