import pool from "../config/database.js";

// Create users table if not exists
export const createUserTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      middle_name VARCHAR(100),
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      phone VARCHAR(20),
      password TEXT NOT NULL,
      address TEXT,
      gender VARCHAR(10),
      dob DATE,
      is_verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
  return result.rows[0];
};

export const createUser = async (data) => {
  const {
    firstName,
    middleName,
    lastName,
    email,
    phone,
    password,
    address,
    gender,
    dob,
  } = data;

  const result = await pool.query(
    `INSERT INTO users (first_name, middle_name, last_name, email, phone, password, address, gender, dob)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [firstName, middleName, lastName, email, phone, password, address, gender, dob]
  );

  return result.rows[0];
};

export const verifyUserEmail = async (email) => {
  await pool.query("UPDATE users SET is_verified=true WHERE email=$1", [email]);
};

export default {
  createUserTable,
  findUserByEmail,
  createUser,
  verifyUserEmail,
};
