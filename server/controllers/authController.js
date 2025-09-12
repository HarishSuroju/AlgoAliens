// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import { findUserByEmail, createUser, verifyUserEmail } from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Temporary in-memory OTP store (⚠️ in production, use Redis or DB with expiry)
const OTP_STORE = {};

// ==================== REGISTER ====================
export const register = async (req, res) => {
  try {
    const {
      firstName,
      middleName, //optional
      lastName,
      email,
      password,
      confirmPassword,
      phone,
      address,
      dob,
      gender,
    } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword || !phone || !dob || !address) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check existing user
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user with isVerified = false
    const newUser = await createUser({
      firstName,
      middleName: middleName || "",
      lastName,
      email,
      password: hashedPassword,
      phone,
      address,
      dob,
      gender,
      isVerified: false,
    });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    OTP_STORE[email] = otp;

    // Send OTP email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"AlienBase Auth" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your account - OTP Code",
      text: `Hello ${firstName},\n\nYour OTP code is: ${otp}\n\nThis code will expire in 5 minutes.`,
    });

    res.status(201).json({
      message:
        "User registered. Please verify your email with OTP before login.",
      user: { id: newUser.id, email: newUser.email },
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ==================== VERIFY OTP ====================
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    if (OTP_STORE[email] === otp) {
      delete OTP_STORE[email];
      await verifyUserEmail(email);
      return res.json({
        message: "✅ Email verified successfully. You can now login.",
      });
    }

    res.status(400).json({ message: "Invalid or expired OTP" });
  } catch (error) {
    console.error("❌ OTP verification error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ==================== LOGIN ====================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Check verification
    if (!user.is_verified) {
      return res
        .status(403)
        .json({ message: "Please verify your email before login" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // JWT token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      message: "✅ Login successful",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        dob: user.dob,
        gender: user.gender,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ==================== ONBOARDING CHECK ====================

const onboarding = await pool.query("SELECT completed FROM onboarding WHERE user_id=$1", [user.id]);
const onboardingCompleted = onboarding.rows[0]?.completed || false;

res.json({
  message: "Login successful",
  token,
  user: { id: user.id, email: user.email },
  needsOnboarding: !onboardingCompleted
});
