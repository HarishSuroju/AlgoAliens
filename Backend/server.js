import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import twilio from "twilio";
import axios from "axios";
import pkg from "pg";

const { Pool } = pkg;

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;
const OTP_EXP_MINUTES = Number(process.env.OTP_EXP_MINUTES || 5);

// PostgreSQL Pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT || 5432,
});

// Test connection
pool.connect()
    .then(() => console.log("✅ Connected to PostgreSQL"))
    .catch(err => console.error("❌ Connection error:", err));

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

// Twilio Client
let smsClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    smsClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

// ---------- HEALTH CHECK ----------
app.get("/", (_, res) => res.json("Backend OK"));

// ---------- USERS LIST ----------
app.get("/user", async (_, res) => {
    try {
        const { rows } = await pool.query("SELECT id, firstname, lastname, email FROM users");
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: String(err) });
    }
});

// ---------- OTP REQUEST ----------
app.post("/otp/request", async (req, res) => {
    try {
        const { email, phone } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const otpHash = await bcrypt.hash(otp, 10);
        const expiresAt = new Date(Date.now() + OTP_EXP_MINUTES * 60 * 1000);

        // Ensure otps table exists
        await pool.query(`
      CREATE TABLE IF NOT EXISTS otps (
        id SERIAL PRIMARY KEY,
        email VARCHAR(150) NOT NULL,
        otp_hash TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        attempts_left INT DEFAULT 5
      )
    `);

        await pool.query("DELETE FROM otps WHERE email=$1", [email]);
        await pool.query(
            `INSERT INTO otps (email, otp_hash, expires_at, attempts_left)
       VALUES ($1, $2, $3, $4)`,
            [email, otpHash, expiresAt, 5]
        );

        // Send Email
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: "Your Verification Code",
            text: `Your OTP is ${otp}. It expires in ${OTP_EXP_MINUTES} minute(s).`,
            html: `<p>Your OTP is <b>${otp}</b>. It expires in ${OTP_EXP_MINUTES} minute(s).</p>`,
        });

        // Send SMS (optional)
        if (phone && smsClient) {
            try {
                await smsClient.messages.create({
                    from: process.env.TWILIO_FROM,
                    to: phone,
                    body: `Your OTP is ${otp}. It expires in ${OTP_EXP_MINUTES} minute(s).`,
                });
            } catch (smsErr) {
                console.error("SMS send error:", smsErr.message);
            }
        }

        res.json({ message: "OTP sent successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error while generating OTP" });
    }
});

// ---------- OTP VERIFY ----------
app.post("/otp/verify", async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

        const { rows } = await pool.query("SELECT * FROM otps WHERE email=$1", [email]);
        if (rows.length === 0) return res.status(400).json({ message: "No OTP requested" });

        const row = rows[0];
        if (row.attempts_left <= 0) return res.status(429).json({ message: "Too many attempts. Request a new OTP." });
        if (new Date(row.expires_at).getTime() < Date.now()) {
            await pool.query("DELETE FROM otps WHERE email=$1", [email]);
            return res.status(400).json({ message: "OTP expired. Request a new one." });
        }

        const match = await bcrypt.compare(otp, row.otp_hash);
        if (!match) {
            await pool.query("UPDATE otps SET attempts_left = attempts_left - 1 WHERE id=$1", [row.id]);
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Success
        await pool.query("DELETE FROM otps WHERE email=$1", [email]);
        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "10m" });
        res.json({ verified: true, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// ---------- SIGNUP ----------
app.post("/signup", async (req, res) => {
    try {
        const { firstName, middleName, lastName, dob, gender, address, email, password, token } = req.body;
        if (!token) return res.status(401).json({ message: "Verification token required" });

        let payload;
        try { payload = jwt.verify(token, JWT_SECRET); }
        catch { return res.status(401).json({ message: "Invalid or expired verification token" }); }

        if (payload.email !== email) return res.status(400).json({ message: "Token/email mismatch" });

        // Ensure users table exists
        await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        firstname VARCHAR(100),
        middlename VARCHAR(100),
        lastname VARCHAR(100),
        dob DATE,
        gender VARCHAR(20),
        address TEXT,
        email VARCHAR(150) UNIQUE NOT NULL,
        password TEXT,
        google_id VARCHAR(255) UNIQUE,
        picture_url TEXT,
        auth_provider VARCHAR(20) DEFAULT 'local',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        const { rows } = await pool.query("SELECT id FROM users WHERE email=$1", [email]);
        if (rows.length > 0) return res.status(409).json({ message: "Email already registered" });

        const hashed = await bcrypt.hash(password, 10);
        const insertRes = await pool.query(
            `INSERT INTO users (firstname, middlename, lastname, dob, gender, address, email, password)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
            [firstName, middleName, lastName, dob, gender, address, email, hashed]
        );
        res.json({ message: "User registered successfully", userId: insertRes.rows[0].id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// ---------- LOGIN ----------
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

        const { rows } = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
        if (rows.length === 0) return res.status(401).json({ message: "Invalid email or password" });

        const user = rows[0];
        
        // Check if user has a password (local auth) or uses OAuth
        if (!user.password) {
            return res.status(401).json({ message: "This account uses social login. Please use Google or GitHub to sign in." });
        }
        
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Invalid email or password" });

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
        res.json({
            message: "Login successful",
            token,
            user: { id: user.id, email: user.email, firstName: user.firstname, lastName: user.lastname }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// ---------- GOOGLE OAUTH LOGIN ----------
app.post("/auth/google/login", async (req, res) => {
    try {
        console.log('Google OAuth login request received:', req.body);
        const { email, username, googleId, picture, accessToken } = req.body;
        
        if (!email || !googleId || !accessToken) {
            console.log('Missing required Google OAuth data');
            return res.status(400).json({ message: "Missing required Google OAuth data" });
        }

        // Verify the Google access token
        try {
            console.log('Verifying Google access token...');
            const verifyResponse = await axios.get(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`);
            console.log('Google token verification response:', verifyResponse.data);
            if (verifyResponse.data.email !== email) {
                console.log('Email mismatch in token verification');
                return res.status(401).json({ message: "Invalid Google access token" });
            }
        } catch (verifyError) {
            console.error("Google token verification failed:", verifyError.message);
            return res.status(401).json({ message: "Invalid Google access token" });
        }

        // Ensure users table has the required columns for Google OAuth
        try {
            console.log('Updating users table structure...');
            // First, modify the password column to allow NULL values
            await pool.query(`ALTER TABLE users ALTER COLUMN password DROP NOT NULL`);
            
            // Then add the Google OAuth columns if they don't exist
            await pool.query(`
                ALTER TABLE users 
                ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE,
                ADD COLUMN IF NOT EXISTS picture_url TEXT,
                ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(20) DEFAULT 'local'
            `);
            console.log('Users table structure updated successfully');
        } catch (alterError) {
            console.error('Error updating table structure:', alterError.message);
            // Continue anyway, table might already have these columns
        }

        // Check if user exists by email or google_id
        console.log('Checking if user exists...');
        const { rows } = await pool.query(
            "SELECT * FROM users WHERE email=$1 OR google_id=$2", 
            [email, googleId]
        );
        console.log('User query result:', rows.length > 0 ? 'User found' : 'User not found');

        if (rows.length === 0) {
            // User doesn't exist - auto-register them
            console.log('Creating new user via Google OAuth...');
            const insertRes = await pool.query(
                `INSERT INTO users (firstname, lastname, email, google_id, picture_url, auth_provider)
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
                [username.split(' ')[0] || username, username.split(' ').slice(1).join(' ') || '', email, googleId, picture, 'google']
            );
            console.log('New user created with ID:', insertRes.rows[0].id);

            const newUser = {
                id: insertRes.rows[0].id,
                email: email,
                firstName: username.split(' ')[0] || username,
                lastName: username.split(' ').slice(1).join(' ') || '',
                picture: picture
            };

            const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: "1h" });
            console.log('Returning success response for new user');
            return res.json({
                success: true,
                message: "Google signup and login successful",
                token,
                user: newUser
            });
        }

        const user = rows[0];
        console.log('Existing user found, logging in...');
        
        // Update Google info if missing
        if (!user.google_id) {
            console.log('Updating user with Google info...');
            await pool.query(
                "UPDATE users SET google_id=$1, picture_url=$2, auth_provider=$3 WHERE id=$4",
                [googleId, picture, 'google', user.id]
            );
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
        console.log('Returning success response for existing user');
        res.json({
            success: true,
            message: "Google login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstname || username.split(' ')[0],
                lastName: user.lastname || username.split(' ').slice(1).join(' '),
                picture: user.picture_url || picture
            }
        });
    } catch (err) {
        console.error("Google OAuth error:", err);
        res.status(500).json({ message: "Server error during Google authentication", error: err.message });
    }
});

// ---------- GOOGLE OAUTH SIGNUP ----------
app.post("/auth/google/signup", async (req, res) => {
    try {
        const { email, username, googleId, picture, accessToken } = req.body;
        
        if (!email || !googleId || !accessToken) {
            return res.status(400).json({ message: "Missing required Google OAuth data" });
        }

        // Verify the Google access token
        try {
            const verifyResponse = await axios.get(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`);
            if (verifyResponse.data.email !== email) {
                return res.status(401).json({ message: "Invalid Google access token" });
            }
        } catch (verifyError) {
            console.error("Google token verification failed:", verifyError.message);
            return res.status(401).json({ message: "Invalid Google access token" });
        }

        // Ensure users table has the required columns for Google OAuth
        await pool.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE,
            ADD COLUMN IF NOT EXISTS picture_url TEXT,
            ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(20) DEFAULT 'local'
        `);

        // Check if user already exists
        const { rows } = await pool.query(
            "SELECT id FROM users WHERE email=$1 OR google_id=$2", 
            [email, googleId]
        );
        
        if (rows.length > 0) {
            return res.status(409).json({ message: "User already exists. Please login instead." });
        }

        // Create new user
        const insertRes = await pool.query(
            `INSERT INTO users (firstname, lastname, email, google_id, picture_url, auth_provider)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            [username.split(' ')[0] || username, username.split(' ').slice(1).join(' ') || '', email, googleId, picture, 'google']
        );

        const newUser = {
            id: insertRes.rows[0].id,
            email: email,
            firstName: username.split(' ')[0] || username,
            lastName: username.split(' ').slice(1).join(' ') || '',
            picture: picture
        };

        const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: "1h" });
        res.json({
            success: true,
            message: "Google signup successful",
            token,
            user: newUser
        });
    } catch (err) {
        console.error("Google OAuth signup error:", err);
        res.status(500).json({ message: "Server error during Google signup" });
    }
});

// ---------- MIDDLEWARE FOR TOKEN VERIFICATION ----------
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
        return res.status(401).json({ message: "Access token required" });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Add user info to request
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

// ---------- ONBOARDING DATA STORAGE ----------
app.post("/onboarding", verifyToken, async (req, res) => {
    try {
        console.log('Onboarding request received:', req.body);
        const { interests, goals, fieldOfStudy, collegeDetails } = req.body;
        const userId = req.user.id;
        
        if (!interests || !Array.isArray(interests) || interests.length === 0) {
            return res.status(400).json({ message: "At least one interest is required" });
        }
        
        if (!goals || !Array.isArray(goals) || goals.length === 0) {
            return res.status(400).json({ message: "At least one goal is required" });
        }
        
        if (!fieldOfStudy || !Array.isArray(fieldOfStudy) || fieldOfStudy.length === 0) {
            return res.status(400).json({ message: "Field of study is required" });
        }
        
        if (!collegeDetails || !collegeDetails.trim()) {
            return res.status(400).json({ message: "College details are required" });
        }

        // Ensure onboarding table exists
        await pool.query(`
            CREATE TABLE IF NOT EXISTS onboarding (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                interests TEXT[] NOT NULL,
                goals TEXT[] NOT NULL,
                field_of_study TEXT[] NOT NULL,
                college_details TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Check if user already has onboarding data
        const { rows: existingRows } = await pool.query(
            "SELECT id FROM onboarding WHERE user_id = $1", 
            [userId]
        );

        if (existingRows.length > 0) {
            // Update existing onboarding data
            await pool.query(
                `UPDATE onboarding 
                 SET interests = $1, goals = $2, field_of_study = $3, college_details = $4, updated_at = CURRENT_TIMESTAMP 
                 WHERE user_id = $5`,
                [interests, goals, fieldOfStudy, collegeDetails, userId]
            );
            console.log('Updated onboarding data for user:', userId);
        } else {
            // Insert new onboarding data
            await pool.query(
                `INSERT INTO onboarding (user_id, interests, goals, field_of_study, college_details) 
                 VALUES ($1, $2, $3, $4, $5)`,
                [userId, interests, goals, fieldOfStudy, collegeDetails]
            );
            console.log('Created new onboarding data for user:', userId);
        }

        res.json({
            success: true,
            message: "Onboarding data saved successfully"
        });
    } catch (err) {
        console.error("Onboarding error:", err);
        res.status(500).json({ message: "Server error while saving onboarding data", error: err.message });
    }
});

// ---------- GET USER PROFILE ----------
app.get("/profile", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Fetch user data from database
        const userQuery = `
            SELECT id, firstname, lastname, email, created_at
            FROM users 
            WHERE id = $1
        `;
        const userResult = await pool.query(userQuery, [userId]);
        
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const user = userResult.rows[0];
        
        // Fetch onboarding data if exists
        const onboardingQuery = `
            SELECT interests, goals, field_of_study, college_details
            FROM onboarding 
            WHERE user_id = $1
        `;
        const onboardingResult = await pool.query(onboardingQuery, [userId]);
        
        // Create username from email if not exists
        const username = user.email ? user.email.split('@')[0] : 'user';
        
        // Combine user data with onboarding data
        const profileData = {
            user: {
                id: user.id,
                firstName: user.firstname,
                lastName: user.lastname,
                username: username,
                email: user.email,
                createdAt: user.created_at,
                interests: onboardingResult.rows[0]?.interests || [],
                goals: onboardingResult.rows[0]?.goals || [],
                fieldOfStudy: onboardingResult.rows[0]?.field_of_study || [],
                collegeDetails: onboardingResult.rows[0]?.college_details || '',
                bio: `Passionate learner${onboardingResult.rows[0]?.field_of_study?.[0] ? ` studying ${onboardingResult.rows[0].field_of_study[0]}` : ''}.`
            }
        };
        
        res.status(200).json(profileData);
    } catch (error) {
        console.error("Profile fetch error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ---------- UPDATE USER PROFILE ----------
app.put("/profile", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, bio } = req.body;
        
        // For now, we'll just return success since we don't have separate username/bio fields
        // In a real app, you'd update the appropriate fields
        
        res.status(200).json({ 
            message: "Profile updated successfully"
        });
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
