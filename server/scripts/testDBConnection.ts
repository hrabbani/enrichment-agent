import dotenv from "dotenv";
dotenv.config();
import { pool } from "../lib/db";

console.log({
  host: process.env.rds_host,
  user: process.env.rds_user,
  database: process.env.rds_db,
});

pool.connect((err) => err && console.log(err));

async function checkConnection() {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Successfully connected to Postgres");
  } catch (err) {
    console.error("❌ Could not connect to Postgres", err);
  } finally {
    await pool.end();
  }
}

checkConnection();
