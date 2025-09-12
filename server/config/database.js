import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "AlienBase",
  password: process.env.DB_PASS || "Raju@33*",
  port: process.env.DB_PORT || 5432,
});

export default pool;

