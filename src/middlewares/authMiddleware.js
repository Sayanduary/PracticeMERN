// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export const requireSignIn = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(401).send({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send({ message: "Invalid or expired token" });
  }
};
