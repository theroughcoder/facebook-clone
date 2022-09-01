import jwt from "jsonwebtoken";

export const generateToken = (user, expired) => {
  return jwt.sign(user, process.env.JWT_SECRET, {expiresIn: expired, });
};
