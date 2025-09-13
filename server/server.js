import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import { createUserTable } from "./models/User.js";
import onboardingRoutes from "./routes/onboardingRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/onboarding", onboardingRoutes);

// Test DB connection
(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Connected to PostgreSQL database");
    client.release();

    // Create users table if not exists
    await createUserTable();
    console.log("✅ Users table ready");
  } catch (err) {
    console.error("❌ Database connection error:", err);
  }
})();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
