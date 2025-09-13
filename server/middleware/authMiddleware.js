import jwt from "jsonwebtoken";
import pool from "../config/database.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // fetch user from DB using correct columns
    const result = await pool.query(
      "SELECT id, first_name, middle_name, last_name, email FROM users WHERE id=$1",
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = result.rows[0];

    // combine names into a single `name` field if needed
    req.user = {
      id: user.id,
      name: [user.first_name, user.middle_name, user.last_name].filter(Boolean).join(" "),
      firstName: user.first_name,
      middleName: user.middle_name,
      lastName: user.last_name,
      email: user.email
    };

    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};

export { authMiddleware };
